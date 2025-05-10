
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Bell, Menu, Search, User, X, Settings, LogOut, BookMarked } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full bg-muted"
                    >
                      <User size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="rounded-full bg-muted p-1">
                        <User size={28} />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">user@example.com</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex w-full cursor-pointer items-center">
                        <BookMarked className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    {user.id === 'admin-1' && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex w-full cursor-pointer items-center">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Admin</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
            {user && user.id === 'admin-1' && (
              <Link 
                to="/admin" 
                className="text-base font-medium text-gray-700 hover:text-finance-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            {!user ? (
              <Button 
                variant="outline" 
                onClick={() => {
                  onLogin?.();
                  setIsMenuOpen(false);
                }}
              >
                Sign In
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => {
                  onLogout?.();
                  setIsMenuOpen(false);
                }}
              >
                Log Out
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
