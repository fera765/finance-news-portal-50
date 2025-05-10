
import { ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";

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
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(openAuthModal);
  const navigate = useNavigate();
  
  // Check for saved user in localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem("financeNewsUser");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user:", e);
        localStorage.removeItem("financeNewsUser");
      }
    }
  }, []);
  
  const handleLogin = () => {
    setIsAuthModalOpen(true);
  };
  
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("financeNewsUser");
    navigate("/");
  };
  
  const handleAuthSuccess = (userData: User) => {
    setIsAuthModalOpen(false);
    setUser(userData);
    
    // Save user to localStorage
    localStorage.setItem("financeNewsUser", JSON.stringify(userData));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Layout;
