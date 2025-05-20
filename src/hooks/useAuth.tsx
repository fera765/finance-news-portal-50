
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '@/components/Layout';
import * as authService from '@/services/authService';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load user data on mount
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        console.log("Current user loaded:", currentUser?.id || "No user found");
      } catch (error) {
        console.error('Failed to load user:', error);
        // Clear any invalid auth data
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login method
  const login = async (email: string, password: string): Promise<User> => {
    setLoading(true);
    try {
      const loggedInUser = await authService.login(email, password);
      setUser(loggedInUser);
      toast.success(`Bem-vindo, ${loggedInUser.name}!`);
      return loggedInUser;
    } catch (error: any) {
      toast.error(error.message || 'Falha no login. Verifique suas credenciais.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout method
  const logout = () => {
    authService.logout();
    setUser(null);
    toast.success('Logout realizado com sucesso');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
