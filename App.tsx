
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import HealthForm from './components/HealthForm';
import RiskDisplay from './components/RiskDisplay';
import ChatBot from './components/ChatBot';
import CatDoctor from './components/CatDoctor';
import GoalTracker from './components/GoalTracker';
import HistoryList from './components/HistoryList';
import AuthModal from './components/AuthModal';
import { analyzeHealthRisk } from './services/geminiService';
import { UserHealthData, RiskAnalysis, AuthUser, HistoryItem, Feedback } from './types';

const App: React.FC = () => {
  const [analysis, setAnalysis] = useState<RiskAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Auth state
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // History state
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // Feedback state
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);

  // Persistence
  useEffect(() => {
    const savedUser = localStorage.getItem('hp_user');
    const savedHistory = localStorage.getItem('hp_history');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem('hp_user', JSON.stringify(user));
    else localStorage.removeItem('hp_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('hp_history', JSON.stringify(history));
  }, [history]);

  const handleAnalysis = async (data: UserHealthData) => {
    setIsAnalyzing(true);
    setError(null);
    setShowFeedbackForm(false);
    setFeedbackGiven(false);
    
    try {
      const result = await analyzeHealthRisk(data);
      setAnalysis(result);
      
      // Save to history if user is logged in
      if (user) {
        const newItem: HistoryItem = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: Date.now(),
          analysis: result,
          inputsSummary: `Age ${data.age}, BMI ${result.metrics.bmi.toFixed(1)}, ${data.mlModel}`
        };
        setHistory(prev => [newItem, ...prev].slice(0, 10)); // Keep last 10
      }

      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (err) {
      console.error(err);
      setError("Failed to generate health report. Dr. Whiskers suggests checking your internet connection!");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFeedbackSubmit = (rating: number, comment: string) => {
    setFeedbackGiven(true);
    setShowFeedbackForm(false);
    // In a real app, send to backend here
    console.log("Feedback received:", { rating, comment });
  };

  return (
    <Layout 
      user={user} 
      onLoginClick={() => setShowAuthModal(true)} 
      onLogout={() => { setUser(null); setHistory([]); }}
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-50 dark:bg-indigo-900/10 rounded-[100%] blur-3xl -z-10 opacity-50 transition-colors"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <CatDoctor />
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6 mt-4">
            AI-Driven Medical Simulation
          </span>
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
            Predict Your Future <br className="hidden md:block"/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-orange-500">Wellness Journey.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
            Harnessing planetary-scale data to simulate your biological trajectory. 
            Dr. Whiskers is ready to analyze your unique lifestyle markers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-5 bg-indigo-600 text-white font-bold rounded-3xl shadow-2xl shadow-indigo-500/30 hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95"
            >
              Analyze My Profile
            </button>
            {!user && (
              <button 
                onClick={() => setShowAuthModal(true)}
                className="px-8 py-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Sign In to Save History
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="form-section" className="py-24 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-black transition-colors scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 order-2 lg:order-1">
             <HealthForm onSubmit={handleAnalysis} isLoading={isAnalyzing} />
             {user && <HistoryList history={history} onView={(item) => setAnalysis(item.analysis)} onClear={() => setHistory([])} />}
          </div>
          <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-6 order-1 lg:order-2">
            <div className="w-full aspect-square max-w-[320px] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 bg-indigo-50 dark:bg-indigo-900/10">
              <img 
                src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000&auto=format&fit=crop" 
                alt="Doctor Cat" 
                className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1]"
              />
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 text-center">
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                {user ? `"Ready for another checkup, ${user.name}?"` : `"Precision diagnostics require precise data. Let's begin your assessment!"`}
              </p>
              <p className="text-indigo-600 font-bold mt-2 text-xs">— Dr. Whiskers, MD (Master of Diagnostics)</p>
            </div>
          </div>
        </div>
        {error && (
          <div className="mt-8 max-w-2xl mx-auto p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-2xl text-red-600 dark:text-red-400 text-sm font-medium text-center">
            {error}
          </div>
        )}
      </section>

      {/* Results Section */}
      {analysis && (
        <section id="results-section" className="py-24 md:py-32 bg-white dark:bg-slate-950 scroll-mt-20 border-t border-slate-200 dark:border-slate-900 transition-colors">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-indigo-600 font-bold text-xs uppercase tracking-widest block mb-2">Deep Diagnostics</span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">Your Intelligence Report</h2>
              <div className="w-24 h-2 bg-gradient-to-r from-indigo-600 to-orange-500 mx-auto rounded-full mb-8"></div>
              
              {!feedbackGiven ? (
                <button 
                  onClick={() => setShowFeedbackForm(true)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 transition-all border border-slate-200 dark:border-slate-800"
                >
                  Rate this Analysis
                </button>
              ) : (
                <span className="text-xs font-bold text-green-500">Thank you for your feedback! 🐾</span>
              )}
            </div>
            
            {showFeedbackForm && (
              <div className="max-w-xl mx-auto mb-16 p-8 rounded-[2rem] bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-200 dark:border-indigo-900 animate-in slide-in-from-top-4 duration-300">
                <h4 className="font-bold text-slate-900 dark:text-white mb-4">How accurate was Dr. Whiskers?</h4>
                <div className="flex gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      onClick={() => setFeedbackRating(star)}
                      className={`text-2xl transition-transform hover:scale-120 ${feedbackRating >= star ? 'text-yellow-400' : 'text-slate-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea 
                  placeholder="Any additional thoughts for our research team?"
                  className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                  rows={3}
                  id="feedback-comment"
                />
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleFeedbackSubmit(feedbackRating, (document.getElementById('feedback-comment') as HTMLTextAreaElement)?.value)}
                    className="flex-grow py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-md"
                  >
                    Submit Feedback
                  </button>
                  <button 
                    onClick={() => setShowFeedbackForm(false)}
                    className="px-6 py-3 bg-white dark:bg-slate-900 text-slate-600 border border-slate-200 dark:border-slate-800 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            <RiskDisplay analysis={analysis} />
            
            <div className="mt-24 bg-slate-900 dark:bg-slate-900/50 p-12 rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl -z-0 group-hover:bg-indigo-500/20 transition-all"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                <div className="w-24 h-24 rounded-[2rem] bg-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0 animate-pulse">
                  <span className="text-5xl">🐾</span>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-white mb-2">Follow-up with Dr. Whiskers</h4>
                  <p className="text-slate-400 leading-relaxed text-sm max-w-xl">
                    Need more details on your {analysis.riskLevel} risk rating? I can explain the statistical models, suggest specific meal prep ideas, or help you refine your SMART goals.
                  </p>
                </div>
                <button 
                   onClick={() => {/* Managed by ChatBot */}}
                   className="whitespace-nowrap px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg hover:scale-105 active:scale-95"
                >
                  Start Consult
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Goal Tracker Section */}
      <section id="goal-tracker-section" className="py-24 bg-slate-50 dark:bg-black scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Daily Habit Tracker</h2>
            <p className="text-slate-500 dark:text-slate-400">Manage your SMART goals even without a report.</p>
          </div>
          <GoalTracker />
        </div>
      </section>

      {/* Info Section */}
      <section id="info-section" className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white dark:bg-black scroll-mt-20 border-t border-slate-100 dark:border-slate-900">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
          <div className="space-y-6 group">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-6 transition-all duration-300">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Predictive Engines</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Choose between Gradient Boosting for high accuracy or Random Forest for complex non-linear interactions.</p>
          </div>
          <div className="space-y-6 group">
            <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:-rotate-6 transition-all duration-300">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Smart Nutrition</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Automated generation of specific recipes and meal structures optimized for your biological profile.</p>
          </div>
          <div className="space-y-6 group">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Goal Integrity</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">A specialized SMART goal system designed to hold you accountable to your personal medical directives.</p>
          </div>
        </div>
      </section>

      {showAuthModal && (
        <AuthModal 
          onLogin={(user) => { setUser(user); setShowAuthModal(false); }}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      <ChatBot />
    </Layout>
  );
};

export default App;
