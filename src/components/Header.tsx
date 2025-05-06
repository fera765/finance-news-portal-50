
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Bell, Menu, Search, User, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface HeaderProps {
  user?: {
    id: string;
    name: string;
  } | null;
  onLogin?: () => void;
  onLogout?: () => void;
}

export const Header = ({ user, onLogin, onLogout }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleSearch = () => {
    toast({
      title: "Search",
      description: "Search functionality will be implemented in the next version.",
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-finance-900">Finance</span>
              <span className="text-2xl font-normal text-gold-500">News</span>
            </Link>
            <nav className="hidden ml-10 space-x-6 md:flex">
              <Link to="/" className="text-base font-medium text-gray-700 hover:text-finance-700">Home</Link>
              <Link to="/markets" className="text-base font-medium text-gray-700 hover:text-finance-700">Markets</Link>
              <Link to="/business" className="text-base font-medium text-gray-700 hover:text-finance-700">Business</Link>
              <Link to="/economy" className="text-base font-medium text-gray-700 hover:text-finance-700">Economy</Link>
              {user?.id && (
                <Link to="/admin" className="text-base font-medium text-gray-700 hover:text-finance-700">Admin</Link>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSearch}
              className="text-gray-700 hover:text-finance-700"
            >
              <Search size={20} />
            </Button>
            
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-gray-700 hover:text-finance-700"
                >
                  <Bell size={20} />
                </Button>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-muted"
                    onClick={onLogout}
                  >
                    <User size={20} />
                  </Button>
                </div>
              </>
            ) : (
              <Button variant="outline" onClick={onLogin}>
                Sign In
              </Button>
            )}

            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t py-4 px-4">
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-base font-medium text-gray-700 hover:text-finance-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/markets" 
              className="text-base font-medium text-gray-700 hover:text-finance-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Markets
            </Link>
            <Link 
              to="/business" 
              className="text-base font-medium text-gray-700 hover:text-finance-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Business
            </Link>
            <Link 
              to="/economy" 
              className="text-base font-medium text-gray-700 hover:text-finance-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Economy
            </Link>
            {user?.id && (
              <Link 
                to="/admin" 
                className="text-base font-medium text-gray-700 hover:text-finance-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            {!user && (
              <Button 
                variant="outline" 
                onClick={() => {
                  onLogin?.();
                  setIsMenuOpen(false);
                }}
              >
                Sign In
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
