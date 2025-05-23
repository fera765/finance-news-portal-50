
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
      <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Erro de Conexão</h1>
          <p className="text-gray-600 mb-6">
            Não foi possível conectar ao servidor. Verifique se o servidor está em execução 
            ou se houve uma falha na conexão de rede.
          </p>
          <Button onClick={() => window.location.reload()}>
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-gray-50 w-full">
      <AdminSidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        activeTab={activeTab}
      />
      
      <div className="flex-1 overflow-auto flex flex-col">
        {/* Header bar */}
        <div className="sticky top-0 z-10 p-4 bg-white border-b flex justify-between items-center shadow-sm">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCollapsed(!collapsed)}
              className="mr-4 text-gray-600"
            >
              <Menu size={20} />
            </Button>
            <h1 className={cn(
              "text-xl font-semibold transition-all",
              collapsed ? "ml-0" : "ml-2"
            )}>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Stock favorites menu */}
            <DropdownMenu
              open={isStockDropdownOpen}
              onOpenChange={setIsStockDropdownOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <span>Ações</span>
                  {favoriteStocks.length > 0 && (
                    <span className="bg-primary/20 text-primary text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {favoriteStocks.length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Monitorar Ações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isLoading ? (
                  <div className="px-2 py-4 text-center">
                    <div className="animate-spin w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full mx-auto mb-2"></div>
                    <p className="text-sm text-gray-500">Carregando ações...</p>
                  </div>
                ) : stocks.length > 0 ? (
                  stocks.map((stock) => (
                    <DropdownMenuCheckboxItem
                      key={stock.symbol}
                      checked={favoriteStocks.includes(stock.symbol)}
                      onCheckedChange={(checked) => handleToggleFavorite(stock.symbol, checked)}
                    >
                      <div className="flex justify-between w-full items-center">
                        <span>{stock.symbol}</span>
                        <span className={cn(
                          "text-xs font-medium",
                          stock.change >= 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {stock.change >= 0 ? "+" : ""}{stock.change ? stock.change.toFixed(2) : "0.00"}%
                        </span>
                      </div>
                    </DropdownMenuCheckboxItem>
                  ))
                ) : (
                  <div className="px-2 py-4 text-center text-sm text-gray-500">
                    Nenhuma ação disponível
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notificationCount}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-auto">
                  {[...Array(notificationCount)].map((_, i) => (
                    <DropdownMenuItem key={i} className="p-3 cursor-pointer">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">
                          {i % 2 === 0 ? "Novo comentário no artigo" : "Ação em alta"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {Math.floor(Math.random() * 5) + 1} horas atrás
                        </span>
                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
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
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{user ? getInitials(user.name) : "UN"}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">{user?.name || "Admin User"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>Perfil</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/admin/settings")}>Configurações</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full mr-3"></div>
              <span className="text-lg text-gray-600">Carregando...</span>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
