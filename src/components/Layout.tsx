
import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useSiteViews } from "@/hooks/useSiteViews";

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  role?: "user" | "admin" | "editor";
}

interface LayoutProps {
  children: ReactNode;
  openAuthModal?: boolean;
}

const Layout = ({ children, openAuthModal = false }: LayoutProps) => {
  const { user, login, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(openAuthModal);
  const navigate = useNavigate();
  
  // Usar o hook personalizado para rastrear visualizações do site
  useSiteViews();
  
  const handleLogin = () => {
    setIsAuthModalOpen(true);
  };
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  // Updated to match the expected type structure from AuthModal
  const handleAuthSuccess = async (userData: { email: string; password: string }) => {
    try {
      await login(userData.email, userData.password);
      setIsAuthModalOpen(false);
    } catch (error) {
      console.error("Falha na autenticação:", error);
    }
  };

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
        <Header 
          user={user}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
        <main className="flex-grow w-full">
          {children}
        </main>
        <Footer />
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          onSuccess={handleAuthSuccess}
        />
      </div>
    </ThemeProvider>
  );
};

export default Layout;
