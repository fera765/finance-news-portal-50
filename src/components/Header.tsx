
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, Search, X, Settings, LogOut, BookMarked } from "lucide-react";
import { toast } from "sonner";
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
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";

interface HeaderProps {
  user?: UserType | null;
  onLogin?: () => void;
  onLogout?: () => void;
}

export const Header = ({ user, onLogin, onLogout }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Função para lidar com a pesquisa
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

  // Conteúdo do menu de navegação
  const NavigationContent = () => (
    <nav className="flex flex-col space-y-4 w-full">
      {/* Campo de busca */}
      <form onSubmit={handleSearch} className="flex mb-4 w-full">
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
      >
        Início
      </Link>
      <Link 
        to="/markets" 
        className="text-base font-medium text-foreground hover:text-finance-700"
      >
        Mercados
      </Link>
      <Link 
        to="/business" 
        className="text-base font-medium text-foreground hover:text-finance-700"
      >
        Negócios
      </Link>
      <Link 
        to="/economy" 
        className="text-base font-medium text-foreground hover:text-finance-700"
      >
        Economia
      </Link>
      
      {/* Tema */}
      <div className="py-2">
        <span className="text-sm text-muted-foreground mb-2 block">Tema</span>
        <ThemeToggle />
      </div>
      
      {/* Links específicos para usuários logados */}
      {user && (
        <>
          {user.role === 'admin' && (
            <Link 
              to="/admin" 
              className="text-base font-medium text-foreground hover:text-finance-700"
            >
              Admin
            </Link>
          )}
          <Link
            to="/profile"
            className="text-base font-medium text-foreground hover:text-finance-700"
          >
            Perfil
          </Link>
          <Button 
            variant="outline" 
            onClick={onLogout}
            className="w-full mt-2"
          >
            Sair
          </Button>
        </>
      )}
      
      {/* Botão de login para usuários não logados */}
      {!user && (
        <Button 
          variant="outline" 
          onClick={onLogin}
          className="w-full mt-2"
        >
          Entrar
        </Button>
      )}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - sempre visível */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-finance-900">Finance</span>
            <span className="text-2xl font-normal text-gold-500">News</span>
          </Link>

          {/* Elementos para desktop - escondidos em mobile */}
          <div className="hidden md:flex md:flex-1 md:items-center md:justify-between ml-8">
            {/* Links de navegação */}
            <nav className="flex space-x-6">
              <Link to="/" className="text-base font-medium text-foreground hover:text-finance-700">Início</Link>
              <Link to="/markets" className="text-base font-medium text-foreground hover:text-finance-700">Mercados</Link>
              <Link to="/business" className="text-base font-medium text-foreground hover:text-finance-700">Negócios</Link>
              <Link to="/economy" className="text-base font-medium text-foreground hover:text-finance-700">Economia</Link>
            </nav>

            {/* Barra de pesquisa, tema e perfil */}
            <div className="flex items-center space-x-4">
              <form onSubmit={handleSearch} className="relative">
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
              
              <ThemeToggle />
            </div>
          </div>

          {/* Área do usuário e menu para mobile */}
          <div className="flex items-center space-x-2">
            {/* Avatar do usuário - Mostrado em ambos mobile e desktop */}
            {user && (
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
            )}
            
            {/* Botão de login para desktop quando não logado */}
            {!user && !isMobile && (
              <Button variant="outline" onClick={onLogin}>
                Entrar
              </Button>
            )}
            
            {/* Menu mobile - Sempre visível em mobile */}
            <Drawer direction="right">
              <DrawerTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden"
                >
                  <Menu size={20} />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="h-[100dvh] max-w-xs w-full right-0 left-auto rounded-none">
                <div className="p-4 flex flex-col h-full">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Menu</h2>
                    <DrawerClose asChild>
                      <Button variant="ghost" size="icon">
                        <X size={20} />
                      </Button>
                    </DrawerClose>
                  </div>
                  <NavigationContent />
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
