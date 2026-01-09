
import React, { useState, useEffect } from 'react';
import { AuthUser } from '../types';

interface Props {
  children: React.ReactNode;
  user: AuthUser | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

const Layout: React.FC<Props> = ({ children, user, onLoginClick, onLogout }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 bg-slate-50 dark:bg-black`}>
      <header className="sticky top-0 z-50 glass-effect border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">HealthPulse<span className="text-indigo-600">AI</span></span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
            <button onClick={() => scrollToSection('form-section')} className="hover:text-indigo-600 transition-colors">Analyzer</button>
            <button onClick={() => scrollToSection('goal-tracker-section')} className="hover:text-indigo-600 transition-colors">Goal Tracker</button>
            <button onClick={() => scrollToSection('results-section')} className="hover:text-indigo-600 transition-colors">Report</button>
          </nav>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>
            {user ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:block text-xs font-bold text-slate-700 dark:text-slate-300">Hi, {user.name}</span>
                <button 
                  onClick={onLogout}
                  className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-full text-xs font-bold hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={onLoginClick}
                className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white dark:bg-black border-t border-slate-200 dark:border-slate-900 text-slate-500 dark:text-slate-500 py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-slate-900 dark:text-white font-bold mb-4">HealthPulse AI</h3>
              <p className="text-sm leading-relaxed">
                Empowering individuals with data-driven health insights powered by advanced Gemini AI models. 
                Your health journey starts with awareness.
              </p>
            </div>
            <div>
              <h3 className="text-slate-900 dark:text-white font-bold mb-4">Quick Links</h3>
              <ul className="text-sm space-y-2">
                <li><button className="hover:text-indigo-600 transition-colors">Privacy Policy</button></li>
                <li><button className="hover:text-indigo-600 transition-colors">Terms of Service</button></li>
                <li><button className="hover:text-indigo-600 transition-colors">Contact Us</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-slate-900 dark:text-white font-bold mb-4">Disclaimer</h3>
              <p className="text-xs italic leading-relaxed">
                The analysis provided is for educational purposes only. This AI model is not a medical device. 
                Always seek the advice of your physician or other qualified health provider with any questions 
                regarding a medical condition.
              </p>
            </div>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-900 pt-8 text-center text-xs">
            © {new Date().getFullYear()} HealthPulse AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
