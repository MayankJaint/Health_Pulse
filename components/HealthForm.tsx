
import React, { useState } from 'react';
import { UserHealthData, Gender, SmokingStatus, AlcoholConsumption, ExerciseFrequency, DietQuality, MLModel, MLDataset } from '../types';

interface Props {
  onSubmit: (data: UserHealthData) => void;
  isLoading: boolean;
}

const HealthForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [step, setStep] = useState(1);
  const [showDevOptions, setShowDevOptions] = useState(false);
  const [formData, setFormData] = useState<UserHealthData>({
    age: 30,
    gender: Gender.MALE,
    height: 175,
    weight: 70,
    smoking: SmokingStatus.NON_SMOKER,
    alcohol: AlcoholConsumption.NONE,
    exercise: ExerciseFrequency.OCCASIONAL,
    diet: DietQuality.AVERAGE,
    familyHistory: false,
    mlModel: MLModel.RANDOM_FOREST,
    devSettings: {
      dataset: MLDataset.NHANES_2024,
      debugMode: false,
      customContext: '',
      customDatasetContent: '',
      customDatasetFileName: ''
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (name.startsWith('devSettings.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        devSettings: {
          ...prev.devSettings,
          [field]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
                 type === 'number' ? parseFloat(value) : value
      }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        alert('Please upload a valid CSV file.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setFormData(prev => ({
          ...prev,
          devSettings: {
            ...prev.devSettings,
            dataset: MLDataset.CUSTOM_CSV,
            customDatasetContent: content,
            customDatasetFileName: file.name
          }
        }));
      };
      reader.readAsText(file);
    }
  };

  const handleNext = () => setStep(prev => Math.min(prev + 1, 3));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all";
  const labelClasses = "block text-sm font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide";

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-950 p-1 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-900 overflow-hidden">
      <div className="flex bg-slate-50 dark:bg-slate-900/50 p-2 rounded-t-[2.3rem]">
        {[1, 2, 3].map((s) => (
          <button
            key={s}
            onClick={() => setStep(s)}
            className={`flex-grow py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
              step === s 
                ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Step 0{s}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-8 sm:p-12 space-y-8">
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Biological Basics</h3>
              <p className="text-slate-500 text-sm italic">Let's start with your physical measurements.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>Current Age</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} className={inputClasses} required />
              </div>
              <div>
                <label className={labelClasses}>Biological Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className={inputClasses}>
                  <option value={Gender.MALE}>Male</option>
                  <option value={Gender.FEMALE}>Female</option>
                  <option value={Gender.OTHER}>Other</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Height (cm)</label>
                <input type="number" name="height" value={formData.height} onChange={handleChange} className={inputClasses} required />
              </div>
              <div>
                <label className={labelClasses}>Weight (kg)</label>
                <input type="number" name="weight" value={formData.weight} onChange={handleChange} className={inputClasses} required />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="text-center">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Lifestyle Habits</h3>
              <p className="text-slate-500 text-sm italic">These choices impact your health outcomes most.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>Smoking</label>
                <select name="smoking" value={formData.smoking} onChange={handleChange} className={inputClasses}>
                  <option value={SmokingStatus.NON_SMOKER}>Non-smoker</option>
                  <option value={SmokingStatus.FORMER_SMOKER}>Former smoker</option>
                  <option value={SmokingStatus.CURRENT_SMOKER}>Current smoker</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Alcohol</label>
                <select name="alcohol" value={formData.alcohol} onChange={handleChange} className={inputClasses}>
                  <option value={AlcoholConsumption.NONE}>None</option>
                  <option value={AlcoholConsumption.MODERATE}>Moderate</option>
                  <option value={AlcoholConsumption.HEAVY}>Heavy</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Exercise</label>
                <select name="exercise" value={formData.exercise} onChange={handleChange} className={inputClasses}>
                  <option value={ExerciseFrequency.NONE}>None / Sedentary</option>
                  <option value={ExerciseFrequency.OCCASIONAL}>Occasional (1-2x)</option>
                  <option value={ExerciseFrequency.REGULAR}>Regular (3x+)</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Nutrition Quality</label>
                <select name="diet" value={formData.diet} onChange={handleChange} className={inputClasses}>
                  <option value={DietQuality.POOR}>Poor (Processed/Fast Food)</option>
                  <option value={DietQuality.AVERAGE}>Average (Home + Out)</option>
                  <option value={DietQuality.HEALTHY}>Healthy (Clean/Whole)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Clinical Parameters</h3>
              <p className="text-slate-500 text-sm italic">Final details for the predictive engine.</p>
            </div>
            <div className="space-y-6">
              <div>
                <label className={labelClasses}>Intelligence Model</label>
                <select name="mlModel" value={formData.mlModel} onChange={handleChange} className={`${inputClasses} border-indigo-200 dark:border-indigo-900 shadow-sm`}>
                  <option value={MLModel.LOGISTIC_REGRESSION}>{MLModel.LOGISTIC_REGRESSION}</option>
                  <option value={MLModel.RANDOM_FOREST}>{MLModel.RANDOM_FOREST}</option>
                  <option value={MLModel.NEURAL_NETWORK}>{MLModel.NEURAL_NETWORK}</option>
                  <option value={MLModel.GRADIENT_BOOSTING}>{MLModel.GRADIENT_BOOSTING}</option>
                </select>
              </div>
              
              <div className="p-6 rounded-3xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 flex items-center gap-4">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="familyHistory"
                    name="familyHistory"
                    checked={formData.familyHistory}
                    onChange={handleChange}
                    className="w-6 h-6 text-indigo-600 rounded-lg border-slate-300 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>
                <label htmlFor="familyHistory" className="text-sm font-semibold text-indigo-900 dark:text-indigo-200 cursor-pointer">
                  I have a family history of hereditary diseases
                </label>
              </div>

              {/* Developer Options Section */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                <button
                  type="button"
                  onClick={() => setShowDevOptions(!showDevOptions)}
                  className="flex items-center gap-2 text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:opacity-70 transition-opacity"
                >
                  <svg className={`w-4 h-4 transition-transform ${showDevOptions ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                  Developer Settings (Experimental)
                </button>
                
                {showDevOptions && (
                  <div className="mt-6 p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-900/40 border border-dashed border-indigo-200 dark:border-indigo-900 space-y-6 animate-in slide-in-from-top-4 duration-300">
                    <div>
                      <label className={`${labelClasses} text-[10px]`}>Target Training Dataset</label>
                      <select 
                        name="devSettings.dataset" 
                        value={formData.devSettings.dataset} 
                        onChange={handleChange} 
                        className={`${inputClasses} text-sm py-2`}
                      >
                        <option value={MLDataset.NHANES_2024}>{MLDataset.NHANES_2024}</option>
                        <option value={MLDataset.WHO_GLOBAL}>{MLDataset.WHO_GLOBAL}</option>
                        <option value={MLDataset.UK_BIOBANK}>{MLDataset.UK_BIOBANK}</option>
                        <option value={MLDataset.SYNTHETIC_ADVANCED}>{MLDataset.SYNTHETIC_ADVANCED}</option>
                        <option value={MLDataset.CUSTOM_CSV}>{MLDataset.CUSTOM_CSV}</option>
                      </select>
                      <p className="text-[10px] text-slate-400 mt-2">Selecting a dataset simulates the model's training on that archive.</p>
                    </div>

                    {/* CSV Upload Option */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-indigo-100 dark:border-indigo-900/50">
                      <label className={`${labelClasses} text-[10px]`}>Upload Custom Dataset (.csv)</label>
                      <input 
                        type="file" 
                        accept=".csv"
                        onChange={handleFileUpload}
                        className="block w-full text-[10px] text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/40 dark:file:text-indigo-300 cursor-pointer"
                      />
                      {formData.devSettings.customDatasetFileName && (
                        <p className="text-[10px] text-green-600 dark:text-green-400 mt-2 font-mono">
                          Loaded: {formData.devSettings.customDatasetFileName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={`${labelClasses} text-[10px]`}>Custom Calibration Context</label>
                      <textarea
                        name="devSettings.customContext"
                        value={formData.devSettings.customContext}
                        onChange={handleChange}
                        placeholder="e.g. { 'cardio_weight': 1.4, 'age_decay': 0.05 }"
                        className={`${inputClasses} text-sm py-3 min-h-[100px] font-mono`}
                      />
                      <p className="text-[10px] text-slate-400 mt-2">Inject specific domain knowledge to bias the simulation.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-900">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-4 rounded-2xl font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              Previous
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex-grow px-6 py-4 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-grow px-6 py-4 rounded-2xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Analysis...
                </>
              ) : (
                'Run Medical Simulation'
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default HealthForm;
