import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Zap, Globe, MessageSquare, ArrowRight, CheckCircle2, AlertTriangle, FileSearch, Lock } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleVerifyClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login?redirect=%2Fdashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#080c18] text-slate-100 flex flex-col">
      
      {/* HERO SECTION */}
      <section className="relative pt-16 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,229,160,0.12),rgba(255,255,255,0))] pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            AI-Powered · 25 Languages · Real-Time Fact Checker
          </div>

          <h1 className="font-syne text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Stop Misinformation <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
              Before It Spreads
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl mb-10 font-normal leading-relaxed">
            TruthGuard evaluates news headlines, articles, and WhatsApp forwards in seconds using advanced AI NLP engine. Get precise credibility scores and logical consistency reports.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleVerifyClick}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-400 text-slate-950 font-syne font-bold text-base hover:bg-emerald-300 transition-all shadow-[0_0_30px_rgba(0,229,160,0.25)] hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
            >
              <span>Verify Fact Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {!user && (
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-syne font-semibold text-base hover:text-white hover:border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <span>Login to Account</span>
              </Link>
            )}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-20 pt-10 border-t border-slate-800/80">
            <div className="flex flex-col items-center">
              <span className="font-syne font-extrabold text-3xl md:text-4xl text-white">1.2M+</span>
              <span className="text-xs font-medium text-slate-400 mt-1">Facts Analyzed</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-syne font-extrabold text-3xl md:text-4xl text-emerald-400">94.8%</span>
              <span className="text-xs font-medium text-slate-400 mt-1">Engine Accuracy</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-syne font-extrabold text-3xl md:text-4xl text-blue-400">25</span>
              <span className="text-xs font-medium text-slate-400 mt-1">Global Languages</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-syne font-extrabold text-3xl md:text-4xl text-white">&lt; 2s</span>
              <span className="text-xs font-medium text-slate-400 mt-1">Analysis Speed</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6 bg-slate-950/50 border-y border-slate-800/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Workflow</span>
            <h2 className="font-syne text-3xl md:text-4xl font-bold text-white mt-2">Three Steps to Truth</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-8 rounded-2xl border border-slate-800 relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-syne font-extrabold text-xl mb-6">
                01
              </div>
              <h3 className="font-syne font-bold text-xl text-white mb-3">Paste Content</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Paste any headline, full news article text, URL, or forwarded WhatsApp message into the input portal.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl border border-slate-800 relative">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-syne font-extrabold text-xl mb-6">
                02
              </div>
              <h3 className="font-syne font-bold text-xl text-white mb-3">AI Deep Check</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                TruthGuard checks logical meaning, negation inversions, emotional clickbait cues, and verifiable facts.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl border border-slate-800 relative">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-syne font-extrabold text-xl mb-6">
                03
              </div>
              <h3 className="font-syne font-bold text-xl text-white mb-3">Instant Verdict</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Receive a 0-100 credibility score, explicit verdict tag (Verified/Misleading/Fake), summary, and 4 signal badges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Core Capabilities</span>
            <h2 className="font-syne text-3xl md:text-4xl font-bold text-white mt-2">Built for Absolute Fact Security</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-8 rounded-2xl glass-panel-hover">
              <Zap className="w-10 h-10 text-emerald-400 mb-6" />
              <h3 className="font-syne font-bold text-xl text-white mb-3">Real-Time NLP Analysis</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Engineered to detect clickbait, emotional manipulation, and factual inconsistencies instantly.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl glass-panel-hover">
              <Globe className="w-10 h-10 text-blue-400 mb-6" />
              <h3 className="font-syne font-bold text-xl text-white mb-3">25 Language Support</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Supports English, Hindi, Telugu, Tamil, Bengali, Marathi, French, German, Spanish, Arabic, and 15 more languages.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl glass-panel-hover">
              <MessageSquare className="w-10 h-10 text-purple-400 mb-6" />
              <h3 className="font-syne font-bold text-xl text-white mb-3">WhatsApp Forward Verification</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Specially trained to analyze viral WhatsApp messages and social media forwards before you share them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-20 px-6 bg-slate-950/60 border-t border-slate-800/80">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">About TruthGuard</span>
            <h2 className="font-syne text-3xl md:text-4xl font-bold text-white mt-2 mb-6">
              Fighting Misinformation at Scale
            </h2>
            <p className="text-slate-400 text-base leading-relaxed mb-6">
              Misinformation spreads 6x faster than truth on digital networks. TruthGuard was founded to equip citizens with instant, objective AI verification tools.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>Logical consistency and negation handling</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>Protected personal search history and analytics</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>Secure account authentication and session protection</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-96 glass-panel p-8 rounded-2xl border border-slate-800 text-center">
            <ShieldCheck className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h3 className="font-syne font-bold text-2xl text-white mb-2">Ready to Verify?</h3>
            <p className="text-slate-400 text-xs mb-6">Join thousands of users verifying claims before sharing.</p>
            <button
              onClick={handleVerifyClick}
              className="w-full py-3 rounded-xl bg-emerald-400 text-slate-950 font-syne font-bold text-sm hover:bg-emerald-300 transition-all shadow-lg"
            >
              Get Started Now →
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto py-8 px-6 bg-[#050810] border-t border-slate-800/80 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-syne font-bold text-slate-200">TruthGuard AI</span>
          </div>
          <p>© 2026 TruthGuard Platform · All Rights Reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default Home;
