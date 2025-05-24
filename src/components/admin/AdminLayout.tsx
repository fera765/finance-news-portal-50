
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Menu, Bell, LogOut } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { getStocks, getFavoriteStocks, toggleFavoriteStock } from "@/services/stockService";
import { toast } from "sonner";

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
}

const AdminLayout = ({ children, activeTab }: AdminLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stocks, setStocks] = useState<any[]>([]);
  const [favoriteStocks, setFavoriteStocks] = useState<string[]>([]);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [isStockDropdownOpen, setIsStockDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Load stocks and user favorites
  useEffect(() => {
    const fetchStocksData = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        
        const stocksData = await getStocks();
        setStocks(stocksData || []); // Ensure stocks is always an array
        
        if (user?.id) {
          const userFavorites = await getFavoriteStocks(user.id);
          setFavoriteStocks(userFavorites || []); // Ensure favoriteStocks is always an array
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao carregar dados de ações:", error);
        setStocks([]); // Set to empty array on error
        setIsLoading(false);
        setHasError(true);
      }
    };
    
    fetchStocksData();
    
    // Simulate notifications
    setNotificationCount(Math.floor(Math.random() * 5) + 1);
  }, [user?.id]);
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  // Toggle favorite status of a stock
  const handleToggleFavorite = async (symbol: string, checked: boolean) => {
    if (!user?.id) {
      toast.error("Você precisa estar logado para favoritar ações");
      return;
    }
    
    try {
      const success = await toggleFavoriteStock(user.id, symbol, checked);
      
      if (success) {
        setFavoriteStocks(prev => 
          checked 
            ? [...prev, symbol] 
            : prev.filter(s => s !== symbol)
        );
        
        toast.success(
          checked 
            ? `${symbol} adicionada aos favoritos` 
            : `${symbol} removida dos favoritos`
        );
      }
    } catch (error) {
      console.error("Erro ao atualizar favoritos:", error);
      toast.error("Erro ao atualizar favoritos");
    }
  };
  
  // Get user initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  // If there's an error loading essential data, show a fallback UI
  if (hasError) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 flex flex-col items-center justify-center">
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-lg shadow-lg max-w-md w-full text-center border dark:border-slate-800">
          <h1 className="text-xl md:text-2xl font-bold mb-4 text-red-600 dark:text-red-400">Erro de Conexão</h1>
          <p className="text-gray-600 dark:text-slate-300 mb-6 text-sm md:text-base">
            Não foi possível conectar ao servidor. Verifique se o servidor está em execução 
            ou se houve uma falha na conexão de rede.
          </p>
          <Button onClick={() => window.location.reload()} className="w-full">
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 w-full overflow-hidden">
      <AdminSidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        activeTab={activeTab}
      />
      
      <div className="flex-1 overflow-hidden flex flex-col min-w-0">
        {/* Header bar */}
        <div className="sticky top-0 z-10 p-3 md:p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center shadow-sm">
          <div className="flex items-center min-w-0">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCollapsed(!collapsed)}
              className="mr-2 md:mr-4 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              <Menu size={20} />
            </Button>
            <h1 className={cn(
              "text-lg md:text-xl font-semibold transition-all text-slate-900 dark:text-white truncate",
              collapsed ? "ml-0" : "ml-0 md:ml-2"
            )}>
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'articles' && 'Artigos'}
              {activeTab === 'categories' && 'Categorias'}
              {activeTab === 'users' && 'Usuários'}
              {activeTab === 'newsletter' && 'Newsletter'}
              {activeTab === 'settings' && 'Configurações'}
              {!['dashboard', 'articles', 'categories', 'users', 'newsletter', 'settings'].includes(activeTab) && activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
            {/* Stock favorites menu */}
            <DropdownMenu
              open={isStockDropdownOpen}
              onOpenChange={setIsStockDropdownOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 text-xs md:text-sm bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                  <span className="hidden sm:inline">Ações</span>
                  <span className="sm:hidden">$</span>
                  {favoriteStocks.length > 0 && (
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {favoriteStocks.length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                <DropdownMenuLabel className="text-slate-900 dark:text-white">Monitorar Ações</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                {isLoading ? (
                  <div className="px-2 py-4 text-center">
                    <div className="animate-spin w-5 h-5 border-2 border-slate-300 dark:border-slate-600 border-t-blue-600 dark:border-t-blue-400 rounded-full mx-auto mb-2"></div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Carregando ações...</p>
                  </div>
                ) : stocks.length > 0 ? (
                  stocks.map((stock) => (
                    <DropdownMenuCheckboxItem
                      key={stock.symbol}
                      checked={favoriteStocks.includes(stock.symbol)}
                      onCheckedChange={(checked) => handleToggleFavorite(stock.symbol, checked)}
                      className="text-slate-900 dark:text-white"
                    >
                      <div className="flex justify-between w-full items-center">
                        <span>{stock.symbol}</span>
                        <span className={cn(
                          "text-xs font-medium",
                          stock.change >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                        )}>
                          {stock.change >= 0 ? "+" : ""}{stock.change ? stock.change.toFixed(2) : "0.00"}%
                        </span>
                      </div>
                    </DropdownMenuCheckboxItem>
                  ))
                ) : (
                  <div className="px-2 py-4 text-center text-sm text-slate-500 dark:text-slate-400">
                    Nenhuma ação disponível
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Bell size={18} className="text-slate-600 dark:text-slate-300" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 dark:bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                    {notificationCount}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 md:w-80 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                <DropdownMenuLabel className="text-slate-900 dark:text-white">Notificações</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                <div className="max-h-80 overflow-auto">
                  {[...Array(notificationCount)].map((_, i) => (
                    <DropdownMenuItem key={i} className="p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-slate-900 dark:text-white text-sm">
                          {i % 2 === 0 ? "Novo comentário no artigo" : "Ação em alta"}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {Math.floor(Math.random() * 5) + 1} horas atrás
                        </span>
                        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mt-1">
                          {i % 2 === 0 
                            ? "Novo comentário em um artigo recente"
                            : `${stocks[i % stocks.length]?.symbol || 'AAPL'} subiu ${(Math.random() * 5).toFixed(2)}% hoje`
                          }
                        </p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Avatar className="w-7 h-7 md:w-8 md:h-8">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white">
                      {user ? getInitials(user.name) : "UN"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline text-slate-900 dark:text-white">{user?.name || "Usuário Admin"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                <DropdownMenuLabel className="text-slate-900 dark:text-white">Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                <DropdownMenuItem onClick={() => navigate("/profile")} className="text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800">
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/admin/settings")} className="text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800">
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-slate-300 dark:border-slate-600 border-t-blue-600 dark:border-t-blue-400 rounded-full mr-3"></div>
              <span className="text-lg text-slate-600 dark:text-slate-300">Carregando...</span>
            </div>
          ) : (
            <div className="max-w-full">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
