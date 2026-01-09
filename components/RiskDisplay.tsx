
import React from 'react';
import { RiskAnalysis } from '../types';
import { 
  ResponsiveContainer, 
  RadialBarChart, 
  RadialBar, 
  PolarAngleAxis, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis as RadarPolarAngleAxis, 
  Radar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface Props {
  analysis: RiskAnalysis;
}

const RiskDisplay: React.FC<Props> = ({ analysis }) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-600';
      case 'Moderate': return 'text-yellow-600';
      case 'High': return 'text-red-600';
      default: return 'text-slate-600';
    }
  };

  const scoreData = [
    { name: 'Risk', value: analysis.riskScore, fill: analysis.riskLevel === 'Low' ? '#10b981' : analysis.riskLevel === 'Moderate' ? '#f59e0b' : '#ef4444' }
  ];

  const modelPerformanceData = [
    { name: 'Accuracy', value: Math.round(analysis.modelMetrics.accuracy * 100) },
    { name: 'Precision', value: Math.round(analysis.modelMetrics.precision * 100) },
    { name: 'Recall', value: Math.round(analysis.modelMetrics.recall * 100) },
    { name: 'F1 Score', value: Math.round(analysis.modelMetrics.f1Score * 100) },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Card */}
        <div className="col-span-1 md:col-span-1 bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Risk Probability</h3>
          <div className="relative w-44 h-44">
             <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  innerRadius="80%" 
                  outerRadius="100%" 
                  data={scoreData} 
                  startAngle={180} 
                  endAngle={0}
                >
                  <RadialBar background dataKey="value" cornerRadius={30} />
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                </RadialBarChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                <span className={`text-4xl font-black ${getRiskColor(analysis.riskLevel)}`}>{analysis.riskScore}%</span>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-[-4px] uppercase">{analysis.riskLevel} Risk</span>
             </div>
          </div>
          <p className="mt-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
            "Your profile suggests a {analysis.riskLevel.toLowerCase()} health risk profile."
          </p>
        </div>

        {/* Prediction Dimensions Graph */}
        <div className="col-span-1 md:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">ML Risk Vectors</h3>
            <span className="text-[10px] font-bold px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full uppercase">Dimension Mapping</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={analysis.riskDimensions}>
                <PolarGrid stroke="#e2e8f0" />
                <RadarPolarAngleAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                <Radar
                  name="Risk Intensity"
                  dataKey="value"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-2 font-medium">Predicted intensity across primary medical domains.</p>
        </div>
      </div>

      {/* Model Precision & Health Comparison Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Model Precision Line Chart */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Model Precision</h3>
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={modelPerformanceData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 'bold' }} stroke="#94a3b8" axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} hide />
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#6366f1" 
                  strokeWidth={3} 
                  dot={{ r: 6, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-slate-400 mt-4 text-center">Confidence curve based on simulated validation set.</p>
        </div>

        {/* Health Comparative Balance Line Chart */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
           <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Health Balance</h3>
            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analysis.healthComparison} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 10, fontWeight: 'bold' }} stroke="#94a3b8" axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Line 
                  name="Your Profile" 
                  type="monotone" 
                  dataKey="userScore" 
                  stroke="#6366f1" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#6366f1' }}
                  animationDuration={1500}
                />
                <Line 
                  name="Ideal Baseline" 
                  type="monotone" 
                  dataKey="idealScore" 
                  stroke="#e2e8f0" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  dot={{ r: 4, fill: '#cbd5e1' }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-slate-400 mt-4 text-center">Resilience trajectory against medically optimized targets.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Simulation Reasoning</h3>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
          {analysis.summary}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Biological Marker: BMI</span>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{analysis.metrics.bmi.toFixed(1)}</span>
              <span className="text-sm font-medium text-slate-500 mb-1">{analysis.metrics.bmiCategory}</span>
            </div>
          </div>
          <div className="p-5 rounded-3xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/40">
            <span className="text-xs font-bold text-indigo-400 dark:text-indigo-500 uppercase block mb-1">Health Viability Index</span>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{analysis.lifestyleScore}/100</span>
              <span className="text-sm font-medium text-slate-500 mb-1">Overall Resilience</span>
            </div>
          </div>
        </div>
      </div>

      {/* Diet Recommendation Section */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Precision Nutrition Plan</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic border-l-4 border-orange-400 pl-4">
              {analysis.dietPlan.summary}
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-3xl border border-green-100 dark:border-green-900/30">
                <h4 className="text-sm font-bold text-green-700 dark:text-green-400 mb-2">Increase</h4>
                <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
                  {analysis.dietPlan.doEat.map((item, idx) => <li key={idx} className="flex gap-2"><span>•</span> {item}</li>)}
                </ul>
              </div>
              <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-3xl border border-red-100 dark:border-red-900/30">
                <h4 className="text-sm font-bold text-red-700 dark:text-red-400 mb-2">Minimize</h4>
                <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
                  {analysis.dietPlan.avoid.map((item, idx) => <li key={idx} className="flex gap-2"><span>•</span> {item}</li>)}
                </ul>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
              <h4 className="text-md font-bold text-slate-900 dark:text-white mb-4">Meal Cadence</h4>
              <div className="space-y-4">
                {Object.entries(analysis.dietPlan.sampleMealPlan).map(([meal, desc]) => (
                  <div key={meal} className="flex gap-4">
                    <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 w-16 pt-1">{meal}</span>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{desc as string}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-md font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Doctor's Top Picks
            </h4>
            <div className="grid grid-cols-1 gap-4">
              {analysis.dietPlan.recipes.map((recipe, idx) => (
                <div key={idx} className="p-6 rounded-[2rem] bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                  <h5 className="font-bold text-indigo-600 dark:text-indigo-400 mb-2">{recipe.name}</h5>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {recipe.ingredients.slice(0, 4).map((ing, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full">{ing}</span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">"{recipe.benefits}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Vulnerabilities</h3>
          </div>
          <ul className="space-y-4">
            {analysis.topRisks.map((risk, i) => (
              <li key={i} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                <span className="w-6 h-6 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">{risk}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Optimization</h3>
          </div>
          <ul className="space-y-4">
            {analysis.recommendations.map((rec, i) => (
              <li key={i} className="flex gap-3 p-3 rounded-2xl hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors">
                <div className="mt-1">
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RiskDisplay;
