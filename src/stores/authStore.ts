import { create } from 'zustand';
import type { User } from '@/types';
import { authApi } from '@/lib/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  fetchUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,

  initialize: async () => {
    if (get().isInitialized) return;
    set({ isLoading: true });
    try {
      localStorage.removeItem('token');
      const sessionRes = await authApi.getSession();
      if (sessionRes.success && sessionRes.data?.session) {
        const me = await authApi.getMe();
        if (me.success && me.data?.user) {
          set({
            user: me.data.user,
            isAuthenticated: true,
            isLoading: false,
            isInitialized: true,
          });
          return;
        }
      }
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(email, password);
      if (response.success && response.data?.user) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
        });
        return true;
      }
      set({
        error: response.error || 'Login failed',
        isLoading: false,
      });
      return false;
    } catch {
      set({
        error: 'Login failed',
        isLoading: false,
      });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authApi.logout();
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const response = await authApi.getMe();
      if (response.success && response.data?.user) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
