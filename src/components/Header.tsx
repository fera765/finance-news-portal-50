
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, Search, X, Settings, LogOut, BookMarked } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserType } from "./Layout";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

interface HeaderProps {
  user?: UserType | null;
  onLogin?: () => void;
  onLogout?: () => void;
}

export const Header = ({ user, onLogin, onLogout }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  // Nova função para lidar com a pesquisa
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-finance-900">Finance</span>
              <span className="text-2xl font-normal text-gold-500">News</span>
            </Link>
            <nav className="hidden ml-10 space-x-6 md:flex">
              <Link to="/" className="text-base font-medium text-foreground hover:text-finance-700">Início</Link>
              <Link to="/markets" className="text-base font-medium text-foreground hover:text-finance-700">Mercados</Link>
              <Link to="/business" className="text-base font-medium text-foreground hover:text-finance-700">Negócios</Link>
              <Link to="/economy" className="text-base font-medium text-foreground hover:text-finance-700">Economia</Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Botão de alternância de tema */}
            <ThemeToggle />

            {/* Campo de busca substituindo as notificações */}
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <Input 
                type="search"
                placeholder="Buscar notícias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-[200px] pr-8"
              />
              <Button 
                type="submit" 
                variant="ghost" 
                size="icon" 
                className="absolute right-0 top-0 text-foreground hover:text-finance-700"
              >
                <Search size={18} />
              </Button>
            </form>
            
            {/* Ícone de busca para mobile */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/search')}
              className="md:hidden text-foreground hover:text-finance-700"
            >
              <Search size={20} />
            </Button>
            
            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="rounded-full h-10 w-10 p-0"
                    >
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-popover">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email || "usuario@exemplo.com"}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex w-full cursor-pointer items-center">
                        <BookMarked className="mr-2 h-4 w-4" />
                        <span>Perfil</span>
                      </Link>
                    </DropdownMenuItem>
                    {user.role === 'admin' && (
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
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button variant="outline" onClick={onLogin}>
                Entrar
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
        <div className="md:hidden bg-background border-t border-border py-4 px-4">
          <nav className="flex flex-col space-y-4">
            {/* Campo de busca mobile */}
            <form onSubmit={handleSearch} className="flex mb-2">
              <Input 
                type="search"
                placeholder="Buscar notícias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 mr-2"
              />
              <Button type="submit">Buscar</Button>
            </form>
            
            <Link 
              to="/" 
              className="text-base font-medium text-foreground hover:text-finance-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Início
            </Link>
            <Link 
              to="/markets" 
              className="text-base font-medium text-foreground hover:text-finance-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Mercados
            </Link>
            <Link 
              to="/business" 
              className="text-base font-medium text-foreground hover:text-finance-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Negócios
            </Link>
            <Link 
              to="/economy" 
              className="text-base font-medium text-foreground hover:text-finance-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Economia
            </Link>
            {user && user.role === 'admin' && (
              <Link 
                to="/admin" 
                className="text-base font-medium text-foreground hover:text-finance-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            {user && (
              <Link
                to="/profile"
                className="text-base font-medium text-foreground hover:text-finance-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Perfil
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
                Entrar
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => {
                  onLogout?.();
                  setIsMenuOpen(false);
                }}
              >
                Sair
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
