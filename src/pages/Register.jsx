import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User, Mail, Lock, Eye, EyeOff, Check, X, ArrowRight } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Real-time password validation rule checklist
  const passwordChecks = {
    minLen: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-.\?]/.test(password),
    noSpaces: !/\s/.test(password)
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const res = register(fullName, email, password, confirmPassword);
    setLoading(false);

    if (res.success) {
      // Successfully registered — DO NOT AUTO LOG IN. Redirect to Login page.
      navigate('/login?registered=1');
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-[#080c18] flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,160,0.06),transparent_70%)] pointer-events-none"></div>

      <div className="w-full max-w-md glass-panel p-8 md:p-10 rounded-3xl border border-slate-800 shadow-2xl relative z-10 animate-fade-in my-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
            <ShieldCheck className="w-4 h-4" />
            <span>Join TruthGuard</span>
          </div>
          <h1 className="font-syne text-2xl md:text-3xl font-extrabold text-white">Create Account</h1>
          <p className="text-slate-400 text-xs mt-2">Verify news, fight misinformation, and protect truth.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Vaishnavi Sama"
                required
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                required
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all placeholder:text-slate-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Live Password Checklist */}
            {password.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px]">
                <div className={`flex items-center gap-1.5 ${passwordChecks.minLen ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                  {passwordChecks.minLen ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  <span>8+ Characters</span>
                </div>
                <div className={`flex items-center gap-1.5 ${passwordChecks.uppercase ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                  {passwordChecks.uppercase ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  <span>1 Uppercase</span>
                </div>
                <div className={`flex items-center gap-1.5 ${passwordChecks.lowercase ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                  {passwordChecks.lowercase ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  <span>1 Lowercase</span>
                </div>
                <div className={`flex items-center gap-1.5 ${passwordChecks.number ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                  {passwordChecks.number ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  <span>1 Number</span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Confirm Password</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all placeholder:text-slate-600"
              />
            </div>
            {confirmPassword.length > 0 && confirmPassword !== password && (
              <span className="text-[11px] text-rose-400 mt-1 block">Passwords do not match</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-emerald-400 text-slate-950 font-syne font-bold text-sm hover:bg-emerald-300 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-emerald-400 hover:underline">
            Log In here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
