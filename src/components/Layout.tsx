
import { ReactNode, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";

interface LayoutProps {
  children: ReactNode;
  openAuthModal?: boolean; // Add optional prop to open auth modal from child components
}

const Layout = ({ children, openAuthModal = false }: LayoutProps) => {
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(openAuthModal);
  
  const handleLogin = () => {
    setIsAuthModalOpen(true);
  };
  
  const handleLogout = () => {
    setUser(null);
  };
  
  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    setUser({ id: "user-1", name: "John Doe" });
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
