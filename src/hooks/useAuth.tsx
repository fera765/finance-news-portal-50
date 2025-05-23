
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '@/components/Layout';
import * as authService from '@/services/authService';
import { toast } from 'sonner';
import { trackSiteView } from '@/services/viewsService';

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

  // Track site view when app loads
  useEffect(() => {
    const trackInitialView = async () => {
      try {
        await trackSiteView();
        console.log("Initial site view tracked");
      } catch (error) {
        console.error("Failed to track initial site view:", error);
      }
    };
    
    trackInitialView();
  }, []);

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

    // Add a small delay to avoid immediate API calls on page load
    const timer = setTimeout(() => {
      loadUser();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Login method
  const login = async (email: string, password: string): Promise<User> => {
    setLoading(true);
    try {
      const loggedInUser = await authService.login(email, password);
      setUser(loggedInUser);
      toast.success(`Bem-vindo, ${loggedInUser.name}!`);
      
      // Track site view on successful login
      await trackSiteView();
      
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
    
    // Track site view on logout
    trackSiteView().catch(error => {
      console.error("Failed to track site view on logout:", error);
    });
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
