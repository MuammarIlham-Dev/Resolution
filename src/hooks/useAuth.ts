import { useEffect } from 'react';
import { useAuthStore } from '@/stores';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    login,
    logout,
    fetchUser,
    clearError,
  } = useAuthStore();

  useEffect(() => {
    useAuthStore.getState().initialize();
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || !isInitialized,
    error,
    login,
    logout,
    fetchUser,
    clearError,
  };
};
