import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User, Mail, Calendar, CheckCircle2, History, Edit2, Sparkles, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AVATARS = ['🛡️', '🔍', '⚖️', '🤖', '🕵️', '⚡', '🌐', '🧠'];

const Profile = () => {
  const { user, updateUserProfile, history, logout } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || '🛡️');
  const [editing, setEditing] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUserProfile({
      fullName: fullName.trim(),
      avatar: selectedAvatar
    });
    setEditing(false);
  };

  const handleSimulateEmailVerification = () => {
    setVerifyingEmail(true);
    setTimeout(() => {
      updateUserProfile({ verified: true });
      setVerifyingEmail(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#080c18] p-6 max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header Card */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          
          {/* Avatar Selector */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-3xl bg-slate-900 border-2 border-emerald-500/40 text-5xl flex items-center justify-center shadow-xl">
              {selectedAvatar}
            </div>
            <button
              onClick={() => setEditing(true)}
              className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-emerald-400 text-slate-950 hover:bg-emerald-300 shadow-lg transition-all"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* User Details */}
          <div className="text-center md:text-left flex-1 space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h1 className="font-syne font-extrabold text-2xl text-white">{user?.fullName}</h1>
              {user?.verified ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                  Unverified Email
                </span>
              )}
            </div>
            <p className="text-slate-400 text-sm">{user?.email}</p>
            <p className="text-slate-500 text-xs flex items-center justify-center md:justify-start gap-1 pt-1">
              <Calendar className="w-3.5 h-3.5" /> Member Since {user?.created ? new Date(user.created).toLocaleDateString() : 'Today'}
            </p>
          </div>

          {/* Stats Box */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="text-center px-3">
              <span className="font-syne font-bold text-xl text-emerald-400">{history.length}</span>
              <span className="text-[11px] text-slate-400 block">Fact Checks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      {editing ? (
        <form onSubmit={handleSaveProfile} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <h2 className="font-syne font-bold text-base text-white">Edit Profile Details</h2>
          
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Select Avatar Icon</label>
            <div className="flex flex-wrap gap-3">
              {AVATARS.map((av, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedAvatar(av)}
                  className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center border transition-all ${
                    selectedAvatar === av ? 'bg-emerald-500/20 border-emerald-400 scale-110' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-400"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-400 text-slate-950 font-bold text-xs hover:bg-emerald-300 transition-all"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-6 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 font-semibold text-xs hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      {/* Account Status Settings */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="font-syne font-bold text-base text-white">Account Security & Status</h2>
        
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div>
            <span className="text-sm font-semibold text-slate-200 block">Email Verification</span>
            <span className="text-xs text-slate-400">
              {user?.verified ? 'Your email is verified for official reports.' : 'Simulate sending an email verification request.'}
            </span>
          </div>

          {!user?.verified && (
            <button
              onClick={handleSimulateEmailVerification}
              disabled={verifyingEmail}
              className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-xs hover:bg-emerald-500/20 transition-all"
            >
              {verifyingEmail ? 'Verifying...' : 'Verify Email Now'}
            </button>
          )}
        </div>

        <div className="pt-4 flex justify-between items-center border-t border-slate-800">
          <button
            onClick={() => navigate('/history')}
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-emerald-400 transition-colors"
          >
            <History className="w-4 h-4" /> View Full Fact History →
          </button>

          <button
            onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 text-rose-400 font-semibold text-xs hover:bg-rose-500/20 border border-rose-500/20 transition-all"
          >
            <LogOut className="w-4 h-4" /> Logout Session
          </button>
        </div>
      </div>

    </div>
  );
};

export default Profile;
