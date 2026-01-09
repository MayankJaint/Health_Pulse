
import { GoogleGenAI, Type } from "@google/genai";
import { UserHealthData, RiskAnalysis, MLModel, MLDataset } from "../types";

const API_KEY = process.env.API_KEY || "";

export const analyzeHealthRisk = async (userData: UserHealthData): Promise<RiskAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const bmi = userData.weight / ((userData.height / 100) ** 2);
  let bmiCategory = "Normal";
  if (bmi < 18.5) bmiCategory = "Underweight";
  else if (bmi < 25) bmiCategory = "Normal";
  else if (bmi < 30) bmiCategory = "Overweight";
  else bmiCategory = "Obese";

  const isCustomDataset = userData.devSettings.dataset === MLDataset.CUSTOM_CSV;

  const prompt = `
    Perform a comprehensive health risk analysis. 
    Profile:
    - Age: ${userData.age}
    - Gender: ${userData.gender}
    - BMI: ${bmi.toFixed(1)} (${bmiCategory})
    - Smoking: ${userData.smoking}
    - Alcohol: ${userData.alcohol}
    - Exercise: ${userData.exercise}
    - Diet: ${userData.diet}
    - Family History: ${userData.familyHistory ? 'Yes' : 'No'}
    
    ML ENGINE CONFIGURATION:
    - Algorithm: ${userData.mlModel}
    - Simulation Dataset: ${isCustomDataset ? 'Provided Custom CSV' : userData.devSettings.dataset}
    ${userData.devSettings.customContext ? `- Custom Training Context: ${userData.devSettings.customContext}` : ''}
    ${isCustomDataset && userData.devSettings.customDatasetContent ? `
    - CUSTOM DATASET RAW CONTENT (CSV):
    --- START CSV ---
    ${userData.devSettings.customDatasetContent.slice(0, 5000)} ... (truncated for token limits)
    --- END CSV ---
    ` : ''}

    Simulate the prediction logic of the ${userData.mlModel} model. 
    ${isCustomDataset ? 'Analyze the correlations and patterns found in the CUSTOM DATASET RAW CONTENT above to inform the health risk assessment.' : `Simulate the model as if it were trained on the ${userData.devSettings.dataset} dataset.`}
    Use any provided Custom Training Context to calibrate weights.

    Provide:
    1. Overall riskScore (0-100) and riskLevel (Low/Moderate/High).
    2. Detailed summary explaining how the chosen model (${userData.mlModel}) and dataset arrived at these specific conclusions. Mention correlations found in the data.
    3. Specific dietPlan with doEat, avoid, meal plan, and 2 recipes.
    4. lifestyleScore (0-100).
    5. riskDimensions: An array of 5 objects {name, value} representing risk intensity in: Cardiovascular, Metabolic, Respiratory, Mental Health, and Physical Vitality.
    6. modelMetrics: A simulation of the model's performance on the validation set of the chosen dataset (accuracy, precision, recall, f1Score, all 0-1).
    7. healthComparison: A set of 4 comparison categories (Nutrition, Activity, Biological, Mental Resilience) showing userScore vs idealScore (all 0-100).
    8. Actionable recommendations.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskScore: { type: Type.NUMBER },
          riskLevel: { type: Type.STRING },
          summary: { type: Type.STRING },
          topRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          lifestyleScore: { type: Type.NUMBER },
          riskDimensions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                value: { type: Type.NUMBER }
              },
              required: ["name", "value"]
            }
          },
          modelMetrics: {
            type: Type.OBJECT,
            properties: {
              accuracy: { type: Type.NUMBER },
              precision: { type: Type.NUMBER },
              recall: { type: Type.NUMBER },
              f1Score: { type: Type.NUMBER }
            },
            required: ["accuracy", "precision", "recall", "f1Score"]
          },
          healthComparison: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                userScore: { type: Type.NUMBER },
                idealScore: { type: Type.NUMBER }
              },
              required: ["category", "userScore", "idealScore"]
            }
          },
          dietPlan: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              doEat: { type: Type.ARRAY, items: { type: Type.STRING } },
              avoid: { type: Type.ARRAY, items: { type: Type.STRING } },
              sampleMealPlan: {
                type: Type.OBJECT,
                properties: {
                  breakfast: { type: Type.STRING },
                  lunch: { type: Type.STRING },
                  dinner: { type: Type.STRING },
                  snacks: { type: Type.STRING }
                },
                required: ["breakfast", "lunch", "dinner", "snacks"]
              },
              recipes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                    benefits: { type: Type.STRING }
                  },
                  required: ["name", "ingredients", "benefits"]
                }
              }
            },
            required: ["summary", "doEat", "avoid", "sampleMealPlan", "recipes"]
          }
        },
        required: ["riskScore", "riskLevel", "summary", "topRisks", "recommendations", "lifestyleScore", "dietPlan", "riskDimensions", "modelMetrics", "healthComparison"]
      }
    }
  });

  const analysis = JSON.parse(response.text || "{}");
  
  return {
    ...analysis,
    metrics: {
      bmi,
      bmiCategory
    }
  };
};

export const getChatResponse = async (history: {role: 'user' | 'model', text: string}[], message: string) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "You are Dr. Whiskers, a senior cat doctor AI. Help the user understand their report. Keep responses very summarized, brief, and to the point. Maximum 3 sentences unless specifically asked for detail. Use light cat puns. Always include a brief disclaimer: 'Disclaimer: I am an AI, not a human doctor. Consult a professional.'"
    }
  });
  const response = await chat.sendMessage({ message });
  return response.text;
};
