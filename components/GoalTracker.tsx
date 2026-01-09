
import React, { useState } from 'react';
import { SMARTGoal } from '../types';

const GoalTracker: React.FC = () => {
  const [goals, setGoals] = useState<SMARTGoal[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', metric: '', target: '', deadline: '' });

  const addGoal = () => {
    if (!newGoal.title) return;
    const goal: SMARTGoal = {
      id: Math.random().toString(36).substr(2, 9),
      ...newGoal,
      progress: 0,
      completed: false
    };
    setGoals([...goals, goal]);
    setNewGoal({ title: '', metric: '', target: '', deadline: '' });
    setShowAdd(false);
  };

  const updateProgress = (id: string, amount: number) => {
    setGoals(goals.map(g => {
      if (g.id === id) {
        const newProgress = Math.min(100, Math.max(0, g.progress + amount));
        return { ...g, progress: newProgress, completed: newProgress === 100 };
      }
      return g;
    }));
  };

  const removeGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm mt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">SMART Health Goals</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Track your progress to reduce health risks</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          {showAdd ? 'Cancel' : 'Add Goal'}
        </button>
      </div>

      {showAdd && (
        <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 animate-in slide-in-from-top duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input 
              type="text" placeholder="Goal (e.g. Daily Walking)" 
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              value={newGoal.title} onChange={e => setNewGoal({...newGoal, title: e.target.value})}
            />
            <input 
              type="text" placeholder="Metric (e.g. 10k Steps)" 
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              value={newGoal.metric} onChange={e => setNewGoal({...newGoal, metric: e.target.value})}
            />
            <input 
              type="date" 
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              value={newGoal.deadline} onChange={e => setNewGoal({...newGoal, deadline: e.target.value})}
            />
            <button 
              onClick={addGoal}
              className="bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create Goal
            </button>
          </div>
        </div>
      )}

      {goals.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
          <p className="text-slate-400 dark:text-slate-500 text-sm italic">No active goals yet. Set a goal to stay motivated!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map(goal => (
            <div key={goal.id} className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className={`font-bold ${goal.completed ? 'text-green-600 line-through opacity-70' : 'text-slate-900 dark:text-white'}`}>
                    {goal.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Target: {goal.metric} • Due: {goal.deadline || 'Ongoing'}</p>
                </div>
                <button onClick={() => removeGoal(goal.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-grow h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${goal.completed ? 'bg-green-500' : 'bg-indigo-600'}`} 
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => updateProgress(goal.id, -10)} className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center hover:bg-slate-100">-</button>
                  <button onClick={() => updateProgress(goal.id, 10)} className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center hover:bg-indigo-100">+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GoalTracker;
