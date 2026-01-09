
import React from 'react';

const CatDoctor: React.FC<{ mood?: 'happy' | 'thinking' | 'studying' }> = ({ mood = 'happy' }) => {
  return (
    <div className="relative w-32 h-32 mx-auto animate-bounce-slow">
      {/* Simple SVG Cat Doctor */}
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        {/* Body */}
        <ellipse cx="50" cy="70" rx="30" ry="25" fill="#f1f5f9" className="dark:fill-slate-700" stroke="#475569" strokeWidth="2"/>
        {/* Lab Coat */}
        <path d="M30 70 Q50 95 70 70" fill="white" stroke="#e2e8f0" strokeWidth="1"/>
        <rect x="48" y="55" width="4" height="20" fill="#94a3b8"/>
        {/* Head */}
        <circle cx="50" cy="45" r="22" fill="#f1f5f9" className="dark:fill-slate-700" stroke="#475569" strokeWidth="2"/>
        {/* Ears */}
        <path d="M35 30 L28 15 L42 25 Z" fill="#475569" />
        <path d="M65 30 L72 15 L58 25 Z" fill="#475569" />
        {/* Eyes */}
        <circle cx="42" cy="42" r="2.5" fill="#1e293b" className="dark:fill-white animate-pulse"/>
        <circle cx="58" cy="42" r="2.5" fill="#1e293b" className="dark:fill-white animate-pulse"/>
        {/* Glasses */}
        <path d="M35 42 Q42 42 49 42 M51 42 Q58 42 65 42" stroke="#64748b" strokeWidth="1" fill="none" />
        <circle cx="42" cy="42" r="6" stroke="#64748b" strokeWidth="1" fill="none"/>
        <circle cx="58" cy="42" r="6" stroke="#64748b" strokeWidth="1" fill="none"/>
        {/* Nose & Mouth */}
        <path d="M48 48 L52 48 L50 50 Z" fill="#f472b6" />
        <path d="M46 52 Q50 55 54 52" stroke="#475569" strokeWidth="1" fill="none"/>
        {/* Stethoscope */}
        <path d="M40 70 Q50 85 60 70" stroke="#6366f1" strokeWidth="2" fill="none" />
        <circle cx="50" cy="88" r="4" fill="#6366f1" />
      </svg>
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
        Dr. Whiskers
      </div>
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default CatDoctor;
