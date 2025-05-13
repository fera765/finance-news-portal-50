
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  PlusCircle, 
  Zap, 
  Users, 
  FileText, 
  TrendingUp, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Eye,
  Heart,
  Bookmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import GrowthMetrics from "@/components/admin/GrowthMetrics";
import PopularArticles, { ArticleSummary } from "@/components/admin/PopularArticles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MetricsChart from "@/components/admin/MetricsChart";
import SavedArticles from "@/components/admin/SavedArticles";
import { SidebarProvider } from "@/components/ui/sidebar";

// Mock data for admin dashboard
const mockStats = {
  articles: {
    current: 54,
    previous: 42,
    growth: 28.6
  },
  users: {
    current: 1250,
    previous: 1100,
    growth: 13.6
  },
  views: {
    current: 25600,
    previous: 19800,
    growth: 29.3
  }
};

const mockMostViewedArticles: ArticleSummary[] = [
  {
    id: "1",
    title: "Federal Reserve Signals Possible Interest Rate Cuts in Coming Months",
    category: "Economy",
    publishedDate: "2025-05-05T14:30:00Z",
    views: 3245,
    likes: 128
  },
  {
    id: "4",
    title: "Cryptocurrency Market Faces Regulatory Challenges in Major Economies",
    category: "Cryptocurrency",
    publishedDate: "2025-05-05T09:20:00Z",
    views: 2876,
    likes: 95
  },
  {
    id: "2",
    title: "Global Markets Rally as Trade Tensions Ease Between Major Economies",
    category: "Markets",
    publishedDate: "2025-05-04T10:15:00Z",
    views: 2415,
    likes: 112
  },
  {
    id: "5",
    title: "Oil Prices Stabilize Following Middle East Production Agreement",
    category: "Commodities",
    publishedDate: "2025-05-04T18:00:00Z",
    views: 1987,
    likes: 78
  },
  {
    id: "3",
    title: "Tech Giant Unveils Revolutionary AI-Powered Financial Analysis Platform",
    category: "Technology",
    publishedDate: "2025-05-03T16:45:00Z",
    views: 1856,
    likes: 165
  }
];

const mockMostLikedArticles: ArticleSummary[] = [
  {
    id: "3",
    title: "Tech Giant Unveils Revolutionary AI-Powered Financial Analysis Platform",
    category: "Technology",
    publishedDate: "2025-05-03T16:45:00Z",
    views: 1856,
    likes: 165
  },
  {
    id: "1",
    title: "Federal Reserve Signals Possible Interest Rate Cuts in Coming Months",
    category: "Economy",
    publishedDate: "2025-05-05T14:30:00Z",
    views: 3245,
    likes: 128
  },
  {
    id: "2",
    title: "Global Markets Rally as Trade Tensions Ease Between Major Economies",
    category: "Markets",
    publishedDate: "2025-05-04T10:15:00Z",
    views: 2415,
    likes: 112
  },
  {
    id: "4",
    title: "Cryptocurrency Market Faces Regulatory Challenges in Major Economies",
    category: "Cryptocurrency",
    publishedDate: "2025-05-05T09:20:00Z",
    views: 2876,
    likes: 95
  },
  {
    id: "5",
    title: "Oil Prices Stabilize Following Middle East Production Agreement",
    category: "Commodities",
    publishedDate: "2025-05-04T18:00:00Z",
    views: 1987,
    likes: 78
  }
];

const mockMostBookmarkedArticles: ArticleSummary[] = [
  {
    id: "1",
    title: "Federal Reserve Signals Possible Interest Rate Cuts in Coming Months",
    category: "Economy",
    publishedDate: "2025-05-05T14:30:00Z",
    views: 3245,
    likes: 128,
    bookmarks: 89
  },
  {
    id: "3",
    title: "Tech Giant Unveils Revolutionary AI-Powered Financial Analysis Platform",
    category: "Technology",
    publishedDate: "2025-05-03T16:45:00Z",
    views: 1856,
    likes: 165,
    bookmarks: 76
  },
  {
    id: "2",
    title: "Global Markets Rally as Trade Tensions Ease Between Major Economies",
    category: "Markets",
    publishedDate: "2025-05-04T10:15:00Z",
    views: 2415,
    likes: 112,
    bookmarks: 63
  },
  {
    id: "4",
    title: "Cryptocurrency Market Faces Regulatory Challenges in Major Economies",
    category: "Cryptocurrency",
    publishedDate: "2025-05-05T09:20:00Z",
    views: 2876,
    likes: 95,
    bookmarks: 54
  },
  {
    id: "5",
    title: "Oil Prices Stabilize Following Middle East Production Agreement",
    category: "Commodities",
    publishedDate: "2025-05-04T18:00:00Z",
    views: 1987,
    likes: 78,
    bookmarks: 41
  }
];

// Mock data for monthly views
const mockMonthlyViewsData = [
  { month: 'Jan', views: 15200 },
  { month: 'Feb', views: 16700 },
  { month: 'Mar', views: 18400 },
  { month: 'Apr', views: 19800 },
  { month: 'May', views: 25600 },
];

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleNewArticle = () => {
    navigate("/admin/articles");
    toast({
      title: "Criar Artigo",
      description: "Redirecionando para a página de gerenciamento de artigos.",
    });
  };

  return (
    <SidebarProvider>
      <AdminLayout activeTab="dashboard">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-500 mt-1">Bem-vindo de volta, Admin</p>
          </div>
          <Button onClick={handleNewArticle} className="gap-2 shadow-sm">
            <PlusCircle className="h-5 w-5" />
            Novo Artigo
          </Button>
        </div>
        
        {/* Growth Metrics */}
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Métricas de Crescimento</h2>
          <GrowthMetrics
            articlesCount={mockStats.articles.current}
            previousArticlesCount={mockStats.articles.previous}
            usersCount={mockStats.users.current}
            previousUsersCount={mockStats.users.previous}
            viewsCount={mockStats.views.current}
            previousViewsCount={mockStats.views.previous}
          />
        </div>
        
        {/* Monthly Views Chart */}
        <div className="mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center justify-between">
                <span>Visualizações Mensais</span>
                <span className="text-sm font-normal text-green-600 flex items-center">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  +{mockStats.views.growth}%
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MetricsChart data={mockMonthlyViewsData} />
            </CardContent>
          </Card>
        </div>
        
        {/* Popular Articles */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <PopularArticles
            title="Mais Vistos"
            description="Artigos com maior número de visualizações"
            articles={mockMostViewedArticles}
            type="views"
            icon={Eye}
          />
          
          <PopularArticles
            title="Mais Curtidos"
            description="Artigos com maior número de curtidas"
            articles={mockMostLikedArticles}
            type="likes"
            icon={Heart}
          />
          
          <SavedArticles
            title="Mais Salvos"
            description="Artigos mais salvos pelos usuários"
            articles={mockMostBookmarkedArticles}
            icon={Bookmark}
          />
        </div>
        
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Artigos</span>
                <FileText className="h-5 w-5 text-finance-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">{mockStats.articles.current}</div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-green-50 p-2 rounded">
                  <div className="text-sm text-gray-500">Publicados</div>
                  <div className="text-xl font-medium">42</div>
                </div>
                <div className="bg-yellow-50 p-2 rounded">
                  <div className="text-sm text-gray-500">Rascunho</div>
                  <div className="text-xl font-medium">8</div>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <div className="text-sm text-gray-500">Agendados</div>
                  <div className="text-xl font-medium">4</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Usuários</span>
                <Users className="h-5 w-5 text-finance-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">{mockStats.users.current}</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-green-50 p-2 rounded">
                  <div className="text-sm text-gray-500">Ativos</div>
                  <div className="text-xl font-medium">1240</div>
                </div>
                <div className="bg-red-50 p-2 rounded">
                  <div className="text-sm text-gray-500">Banidos</div>
                  <div className="text-xl font-medium">10</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Atividade Hoje</span>
                <Calendar className="h-5 w-5 text-finance-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">67</div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-blue-50 p-2 rounded">
                  <div className="text-sm text-gray-500">Artigos</div>
                  <div className="text-xl font-medium">12</div>
                </div>
                <div className="bg-purple-50 p-2 rounded">
                  <div className="text-sm text-gray-500">Comentários</div>
                  <div className="text-xl font-medium">28</div>
                </div>
                <div className="bg-amber-50 p-2 rounded">
                  <div className="text-sm text-gray-500">Cadastros</div>
                  <div className="text-xl font-medium">27</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Additional Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span>Visão Geral de Desempenho</span>
                <TrendingUp className="h-5 w-5 text-finance-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Visualizações</div>
                  <div className="text-xl font-medium">24.5k</div>
                  <div className="text-xs text-green-600">+12%</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Tempo Médio</div>
                  <div className="text-xl font-medium">2m 45s</div>
                  <div className="text-xs text-green-600">+8%</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Taxa de Rejeição</div>
                  <div className="text-xl font-medium">42%</div>
                  <div className="text-xs text-red-600">+3%</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span>Status do Servidor</span>
                <Zap className="h-5 w-5 text-finance-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Saúde da API</div>
                    <div className="text-sm text-gray-500">Última verificação há 5 minutos</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-green-600">Operacional</span>
                  </div>
                </div>
                <div className="h-1 w-full bg-gray-100 rounded-full">
                  <div className="h-1 rounded-full bg-green-500" style={{ width: "98%" }}></div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                    <div className="text-sm text-gray-500">CPU</div>
                    <div className="text-xl font-medium">12%</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                    <div className="text-sm text-gray-500">Memória</div>
                    <div className="text-xl font-medium">36%</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                    <div className="text-sm text-gray-500">Disco</div>
                    <div className="text-xl font-medium">24%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </SidebarProvider>
  );
};

export default AdminDashboard;
