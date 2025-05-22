
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import AdminSidebar from "@/components/admin/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
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
  
  // Carregar ações e favoritos do usuário
  useEffect(() => {
    const fetchStocksData = async () => {
      try {
        const stocksData = await getStocks();
        setStocks(stocksData || []); // Ensure stocks is always an array
        
        if (user?.id) {
          const userFavorites = await getFavoriteStocks(user.id);
          setFavoriteStocks(userFavorites || []); // Ensure favoriteStocks is always an array
        }
      } catch (error) {
        console.error("Erro ao carregar dados de ações:", error);
        setStocks([]); // Set to empty array on error
      }
    };
    
    fetchStocksData();
    
    // Simular notificações
    setNotificationCount(Math.floor(Math.random() * 5) + 1);
  }, [user?.id]);
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  // Alternar status favorito de uma ação
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
  
  // Pegar as iniciais do nome do usuário
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <SidebarProvider defaultOpen={!collapsed}>
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
              {/* Menu de ações favoritas */}
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
                  {stocks.map((stock) => (
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
                  ))}
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
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
