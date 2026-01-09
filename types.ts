
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

export enum SmokingStatus {
  NON_SMOKER = 'non-smoker',
  FORMER_SMOKER = 'former smoker',
  CURRENT_SMOKER = 'current smoker'
}

export enum AlcoholConsumption {
  NONE = 'none',
  MODERATE = 'moderate',
  HEAVY = 'heavy'
}

export enum ExerciseFrequency {
  NONE = 'none',
  OCCASIONAL = 'occasional',
  REGULAR = 'regular'
}

export enum DietQuality {
  POOR = 'poor',
  AVERAGE = 'average',
  HEALTHY = 'healthy'
}

export enum MLModel {
  LOGISTIC_REGRESSION = 'Logistic Regression',
  RANDOM_FOREST = 'Random Forest',
  NEURAL_NETWORK = 'Neural Network (Deep Learning)',
  GRADIENT_BOOSTING = 'XGBoost/Gradient Boosting'
}

export enum MLDataset {
  NHANES_2024 = 'NHANES 2024 (Clinical)',
  WHO_GLOBAL = 'WHO Global Health Observatory',
  UK_BIOBANK = 'UK Biobank (Genetic + Lifestyle)',
  SYNTHETIC_ADVANCED = 'Synthetic Advanced Medical (v2.1)',
  CUSTOM_CSV = 'Custom CSV Upload'
}

export interface DevSettings {
  dataset: MLDataset;
  customContext?: string;
  customDatasetContent?: string;
  customDatasetFileName?: string;
  debugMode: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface Feedback {
  id: string;
  rating: number;
  comment: string;
  timestamp: number;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  analysis: RiskAnalysis;
  inputsSummary: string;
}

export interface SMARTGoal {
  id: string;
  title: string;
  metric: string;
  target: string;
  deadline: string;
  progress: number;
  completed: boolean;
}

export interface UserHealthData {
  age: number;
  gender: Gender;
  height: number;
  weight: number;
  smoking: SmokingStatus;
  alcohol: AlcoholConsumption;
  exercise: ExerciseFrequency;
  diet: DietQuality;
  familyHistory: boolean;
  mlModel: MLModel;
  devSettings: DevSettings;
}

export interface Recipe {
  name: string;
  ingredients: string[];
  benefits: string;
}

export interface DietRecommendation {
  summary: string;
  doEat: string[];
  avoid: string[];
  sampleMealPlan: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string;
  };
  recipes: Recipe[];
}

export interface RiskDimension {
  name: string;
  value: number; // 0-100
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
}

export interface HealthComparison {
  category: string;
  userScore: number;
  idealScore: number;
}

export interface RiskAnalysis {
  riskScore: number;
  riskLevel: 'Low' | 'Moderate' | 'High';
  summary: string;
  topRisks: string[];
  recommendations: string[];
  lifestyleScore: number;
  dietPlan: DietRecommendation;
  riskDimensions: RiskDimension[];
  modelMetrics: ModelMetrics;
  healthComparison: HealthComparison[];
  metrics: {
    bmi: number;
    bmiCategory: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
