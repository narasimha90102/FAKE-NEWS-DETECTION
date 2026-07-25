import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LogOut, User, History, LayoutDashboard, Menu, X, ArrowRight } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleVerifyClick = (e) => {
    e.preventDefault();
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login?redirect=%2Fdashboard');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#080c18]/90 backdrop-blur-md border-b border-slate-800/80 px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 group-hover:border-emerald-400 transition-colors">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#00e5a0]"></span>
          </div>
          <span className="font-syne font-extrabold text-xl tracking-tight text-white group-hover:text-emerald-400 transition-colors">
            Truth<span className="text-emerald-400">Guard</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800/60">
          {!user ? (
            <>
              <Link 
                to="/" 
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive('/') ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Home
              </Link>
              <a 
                href="#features" 
                className="px-4 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
              >
                Features
              </a>
              <a 
                href="#about" 
                className="px-4 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
              >
                About
              </a>
            </>
          ) : (
            <>
              <Link 
                to="/dashboard" 
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive('/dashboard') ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link 
                to="/history" 
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive('/history') ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <History className="w-4 h-4" />
                History
              </Link>
              <Link 
                to="/profile" 
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive('/profile') ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <User className="w-4 h-4" />
                Profile
              </Link>
            </>
          )}
        </div>

        {/* Right Action Controls */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <>
              <Link 
                to="/login" 
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
              >
                Login
              </Link>
              <button 
                onClick={handleVerifyClick}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-400 text-slate-950 hover:bg-emerald-300 transition-all shadow-[0_0_20px_rgba(0,229,160,0.2)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Verify Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-base">{user.avatar || '🛡️'}</span>
                <span className="text-sm font-semibold text-slate-200">{user.fullName}</span>
              </div>
              <button 
                onClick={() => { logout(); navigate('/'); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden pt-4 pb-3 border-t border-slate-800 mt-3 flex flex-col gap-2">
          {!user ? (
            <>
              <Link to="/" onClick={() => setMobileOpen(false)} className="px-4 py-2 text-slate-300 font-medium hover:bg-slate-800 rounded-lg">Home</Link>
              <a href="#features" onClick={() => setMobileOpen(false)} className="px-4 py-2 text-slate-300 font-medium hover:bg-slate-800 rounded-lg">Features</a>
              <a href="#about" onClick={() => setMobileOpen(false)} className="px-4 py-2 text-slate-300 font-medium hover:bg-slate-800 rounded-lg">About</a>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="px-4 py-2 text-slate-300 font-medium hover:bg-slate-800 rounded-lg">Login</Link>
              <button onClick={(e) => { setMobileOpen(false); handleVerifyClick(e); }} className="w-full py-2.5 bg-emerald-400 text-slate-950 font-bold rounded-xl mt-2">
                Verify Now →
              </button>
            </>
          ) : (
            <>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="px-4 py-2 text-slate-300 font-medium hover:bg-slate-800 rounded-lg">Dashboard</Link>
              <Link to="/history" onClick={() => setMobileOpen(false)} className="px-4 py-2 text-slate-300 font-medium hover:bg-slate-800 rounded-lg">History</Link>
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="px-4 py-2 text-slate-300 font-medium hover:bg-slate-800 rounded-lg">Profile</Link>
              <button onClick={() => { setMobileOpen(false); logout(); navigate('/'); }} className="text-left px-4 py-2 text-rose-400 font-medium hover:bg-rose-500/10 rounded-lg mt-2">
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
