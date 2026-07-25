import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

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

  /* Helper — Get all registered users from local storage */
  const getStoredUsers = () => {
    try {
      return JSON.parse(localStorage.getItem('tg_users') || '[]');
    } catch {
      return [];
    }
  };

  /* Helper — Save registered users */
  const saveStoredUsers = (users) => {
    try {
      localStorage.setItem('tg_users', JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users', e);
    }
  };

  /* Helper — Toast Alert System */
  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  };

  /* Check initial authentication session on load */
  useEffect(() => {
    try {
      const sessionRaw = localStorage.getItem('tg_session') || sessionStorage.getItem('tg_session');
      if (sessionRaw) {
        const session = JSON.parse(sessionRaw);
        const users = getStoredUsers();
        const found = users.find(u => u.id === session.userId || u.email.toLowerCase() === session.email?.toLowerCase());
        if (found) {
          setUser(found);
          loadUserHistory(found.id);
        }
      }
    } catch (e) {
      console.error('Error restoring session', e);
    } finally {
      setLoading(false);
    }
  }, []);

  /* Load user history */
  const loadUserHistory = (userId) => {
    try {
      const historyRaw = localStorage.getItem(`tg_history_${userId}`) || localStorage.getItem('tg_history') || '[]';
      setHistory(JSON.parse(historyRaw));
    } catch {
      setHistory([]);
    }
  };

  /* Add new fact-check entry to history */
  const addHistoryEntry = (entry) => {
    if (!user) return;
    const newEntry = {
      id: 'chk_' + Date.now(),
      date: new Date().toISOString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...entry
    };
    const updated = [newEntry, ...history].slice(0, 50);
    setHistory(updated);
    try {
      localStorage.setItem(`tg_history_${user.id}`, JSON.stringify(updated));
      localStorage.setItem('tg_history', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving history', e);
    }
  };

  /* Clear search history */
  const clearUserHistory = () => {
    if (!user) return;
    setHistory([]);
    try {
      localStorage.removeItem(`tg_history_${user.id}`);
      localStorage.removeItem('tg_history');
      showToast('Search history cleared.', 'info');
    } catch (e) {
      console.error('Error clearing history', e);
    }
  };

  /* ── 1. REGISTRATION WORKFLOW ── */
  const register = (fullName, email, password, confirmPassword) => {
    // 1. Full name check
    if (!fullName || !fullName.trim()) {
      showToast('Full Name is required.', 'error');
      return { success: false, message: 'Full Name is required.' };
    }

    // 2. Email format & uniqueness
    const cleanEmail = email ? email.trim() : '';
    if (!cleanEmail) {
      showToast('Email is required.', 'error');
      return { success: false, message: 'Email is required.' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      showToast('Invalid email address format.', 'error');
      return { success: false, message: 'Invalid email address format.' };
    }

    const users = getStoredUsers();
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail.toLowerCase());
    if (existing) {
      showToast('An account with this email already exists.', 'error');
      return { success: false, message: 'An account with this email already exists.' };
    }

    // 3. Password validation (Min 8 chars)
    if (!password || password.length < 8) {
      showToast('Password must be at least 8 characters long.', 'error');
      return { success: false, message: 'Password must be at least 8 characters long.' };
    }

    // 4. Confirm Password match
    if (password !== confirmPassword) {
      showToast('Confirm password does not match.', 'error');
      return { success: false, message: 'Confirm password does not match.' };
    }

    // Create user object
    const newUser = {
      id: 'usr_' + Date.now(),
      fullName: fullName.trim(),
      email: cleanEmail,
      password: password, // client-side simulation
      avatar: '🛡️',
      created: new Date().toISOString(),
      verified: false
    };

    users.push(newUser);
    saveStoredUsers(users);

    showToast('Account created successfully. Please log in.', 'success');

    // Return success without logging user in automatically
    return {
      success: true,
      message: 'Account created successfully. Please log in.'
    };
  };

  /* ── 2. LOGIN WORKFLOW ── */
  const login = (email, password, rememberMe = false) => {
    const cleanEmail = email ? email.trim() : '';
    if (!cleanEmail || !password) {
      showToast('Please fill in both email and password.', 'error');
      return { success: false, message: 'Please fill in both email and password.' };
    }

    const users = getStoredUsers();
    const found = users.find(
      u => u.email.toLowerCase() === cleanEmail.toLowerCase() && u.password === password
    );

    if (!found) {
      showToast('Invalid email or password.', 'error');
      return { success: false, message: 'Invalid email or password.' };
    }

    const sessionData = { userId: found.id, email: found.email, loginTime: new Date().toISOString() };

    if (rememberMe) {
      localStorage.setItem('tg_session', JSON.stringify(sessionData));
      sessionStorage.removeItem('tg_session');
    } else {
      sessionStorage.setItem('tg_session', JSON.stringify(sessionData));
      localStorage.removeItem('tg_session');
    }

    setUser(found);
    loadUserHistory(found.id);
    showToast(`Welcome back, ${found.fullName}!`, 'success');

    return { success: true, user: found };
  };

  /* ── 3. LOGOUT WORKFLOW ── */
  const logout = () => {
    localStorage.removeItem('tg_session');
    sessionStorage.removeItem('tg_session');
    setUser(null);
    setHistory([]);
    showToast('Logged out successfully.', 'info');
  };

  /* Update Profile */
  const updateUserProfile = (updates) => {
    if (!user) return { success: false, message: 'Not logged in' };
    const users = getStoredUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx === -1) return { success: false, message: 'User not found' };

    const updatedUser = { ...users[idx], ...updates };
    users[idx] = updatedUser;
    saveStoredUsers(users);

    setUser(updatedUser);
    showToast('Profile updated successfully!', 'success');
    return { success: true, user: updatedUser };
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
