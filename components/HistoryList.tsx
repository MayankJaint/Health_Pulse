
import React from 'react';
import { HistoryItem } from '../types';

interface Props {
  history: HistoryItem[];
  onView: (item: HistoryItem) => void;
  onClear: () => void;
}

const HistoryList: React.FC<Props> = ({ history, onView, onClear }) => {
  if (history.length === 0) return null;

  return (
    <div className="mt-12 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Analysis History</h3>
        <button 
          onClick={onClear}
          className="text-xs font-bold text-red-500 hover:underline uppercase tracking-widest"
        >
          Clear History
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.map((item) => (
          <div 
            key={item.id}
            onClick={() => onView(item)}
            className="group cursor-pointer p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                item.analysis.riskLevel === 'Low' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                item.analysis.riskLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {item.analysis.riskLevel}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {new Date(item.timestamp).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">{item.inputsSummary}</p>
            <p className="text-[10px] text-slate-400 mb-4">Risk Score: {item.analysis.riskScore}%</p>
            <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              View Details <span>→</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;
