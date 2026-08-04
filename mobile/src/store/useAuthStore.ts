import { create } from 'zustand';
import { apiClient, setAuthToken } from '../api/apiClient';

export interface UserProfile {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  verified?: boolean;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      if (response.data?.success && response.data?.user) {
        const user = response.data.user;
        const fakeToken = `jwt_${user._id}_${Date.now()}`;
        setAuthToken(fakeToken);
        set({ user, token: fakeToken, isAuthenticated: true, isLoading: false });
        return true;
      } else {
        set({ error: response.data?.error || 'Invalid credentials', isLoading: false });
        return false;
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Login failed. Please check network connection.';
      set({ error: msg, isLoading: false });
      return false;
    }
  },

  register: async (username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/auth/register', { username, email, password });
      if (response.data?.success && response.data?.user) {
        const user = response.data.user;
        const fakeToken = `jwt_${user._id}_${Date.now()}`;
        setAuthToken(fakeToken);
        set({ user, token: fakeToken, isAuthenticated: true, isLoading: false });
        return true;
      } else {
        set({ error: response.data?.error || 'Registration failed', isLoading: false });
        return false;
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Registration failed. Please check network connection.';
      set({ error: msg, isLoading: false });
      return false;
    }
  },

  logout: () => {
    setAuthToken(null);
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  clearError: () => set({ error: null }),
}));
