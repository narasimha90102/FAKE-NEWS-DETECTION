import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
const API_BASE = 'https://fake-news-detection-zmkd.onrender.com/api';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [history, setHistory] = useState([]);

  /* Helper — Toast Alert System */
  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  };

  /* ── Session helpers ── */
  const saveSession = (token, userData, rememberMe) => {
    const data = JSON.stringify({ token, user: userData });
    if (rememberMe) {
      localStorage.setItem('tc_session', data);
      sessionStorage.removeItem('tc_session');
    } else {
      sessionStorage.setItem('tc_session', data);
      localStorage.removeItem('tc_session');
    }
    localStorage.setItem('token', token);
    localStorage.setItem('auth_token', token);
  };

  const getSession = () => {
    try {
      const raw = sessionStorage.getItem('tc_session') || localStorage.getItem('tc_session');
      if (!raw) return null;
      return JSON.parse(raw);
    } catch { return null; }
  };

  /* Restore session on page load */
  useEffect(() => {
    const session = getSession();
    if (session?.user) {
      setUser(session.user);
      loadUserHistory(session.user._id || session.user.id);
    }
    setLoading(false);
  }, []);

  /* Load user history from localStorage */
  const loadUserHistory = (userId) => {
    try {
      const historyRaw = localStorage.getItem(`tc_history_${userId}`) || localStorage.getItem('tg_history') || '[]';
      setHistory(JSON.parse(historyRaw));
    } catch {
      setHistory([]);
    }
  };

  /* Add new fact-check entry to history */
  const addHistoryEntry = (entry) => {
    if (!user) return;
    const userId = user._id || user.id;
    const newEntry = {
      id: 'chk_' + Date.now(),
      date: new Date().toISOString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...entry
    };
    const updated = [newEntry, ...history].slice(0, 50);
    setHistory(updated);
    try {
      localStorage.setItem(`tc_history_${userId}`, JSON.stringify(updated));
      localStorage.setItem('tg_history', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving history', e);
    }
  };

  /* Clear search history */
  const clearUserHistory = () => {
    if (!user) return;
    const userId = user._id || user.id;
    setHistory([]);
    try {
      localStorage.removeItem(`tc_history_${userId}`);
      localStorage.removeItem('tg_history');
      showToast('Search history cleared.', 'info');
    } catch (e) {
      console.error('Error clearing history', e);
    }
  };

  /* ── 1. REGISTRATION → MongoDB via Render ── */
  const register = async (fullName, email, password, confirmPassword) => {
    if (!fullName || !fullName.trim()) {
      showToast('Full Name is required.', 'error');
      return { success: false, message: 'Full Name is required.' };
    }

    const cleanEmail = email ? email.trim() : '';
    if (!cleanEmail) {
      showToast('Email is required.', 'error');
      return { success: false, message: 'Email is required.' };
    }

    if (!password || password.length < 6) {
      showToast('Password must be at least 6 characters long.', 'error');
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }

    if (password !== confirmPassword) {
      showToast('Confirm password does not match.', 'error');
      return { success: false, message: 'Confirm password does not match.' };
    }

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: fullName.trim(), email: cleanEmail, password })
      });
      const data = await res.json();

      if (data.success && data.user) {
        showToast('Account created successfully. Please log in.', 'success');
        return { success: true, message: 'Account created successfully. Please log in.' };
      }
      showToast(data.error || 'Registration failed.', 'error');
      return { success: false, message: data.error || 'Registration failed.' };
    } catch (err) {
      showToast('Network error. Please check your connection.', 'error');
      return { success: false, message: 'Network error. Please check your connection.' };
    }
  };

  /* ── 2. LOGIN → MongoDB via Render ── */
  const login = async (email, password, rememberMe = false) => {
    const cleanEmail = email ? email.trim() : '';
    if (!cleanEmail || !password) {
      showToast('Please fill in both email and password.', 'error');
      return { success: false, message: 'Please fill in both email and password.' };
    }

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      });
      const data = await res.json();

      if (data.success && data.user) {
        saveSession(data.token, data.user, rememberMe);
        setUser(data.user);
        loadUserHistory(data.user._id || data.user.id);
        showToast(`Welcome back, ${data.user.username}!`, 'success');
        return { success: true, user: data.user };
      }
      showToast(data.error || 'Invalid email or password.', 'error');
      return { success: false, message: data.error || 'Invalid email or password.' };
    } catch (err) {
      showToast('Network error. Please check your connection.', 'error');
      return { success: false, message: 'Network error. Please check your connection.' };
    }
  };

  /* ── 3. LOGOUT ── */
  const logout = () => {
    localStorage.removeItem('tc_session');
    sessionStorage.removeItem('tc_session');
    localStorage.removeItem('token');
    localStorage.removeItem('auth_token');
    setUser(null);
    setHistory([]);
    showToast('Logged out successfully.', 'info');
  };

  /* Update Profile */
  const updateUserProfile = async (updates) => {
    if (!user) return { success: false, message: 'Not logged in' };
    const session = getSession();
    const token = session?.token;
    const userId = user._id || user.id;

    try {
      const res = await fetch(`${API_BASE}/auth/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.success) {
        const rememberMe = !!localStorage.getItem('tc_session');
        saveSession(token, data.user, rememberMe);
        setUser(data.user);
        showToast('Profile updated successfully!', 'success');
        return { success: true, user: data.user };
      }
      return { success: false, message: data.error || 'Update failed' };
    } catch (err) {
      return { success: false, message: 'Network error.' };
    }
  };

  const value = {
    user,
    loading,
    toast,
    history,
    register,
    login,
    logout,
    updateUserProfile,
    addHistoryEntry,
    clearUserHistory,
    showToast
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {/* Global Toast Alert Component */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[9999] animate-fade-in">
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl backdrop-blur-xl border text-sm font-medium ${
            toast.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
              : toast.type === 'error'
              ? 'bg-rose-950/80 border-rose-500/40 text-rose-300'
              : 'bg-blue-950/80 border-blue-500/40 text-blue-300'
          }`}>
            <span className="text-base font-bold">
              {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}
            </span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};
