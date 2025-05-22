
import { useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import GrowthMetrics from "@/components/admin/GrowthMetrics";
import MetricsChart from "@/components/admin/MetricsChart";
import PopularArticles from "@/components/admin/PopularArticles";
import SavedArticles from "@/components/admin/SavedArticles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Heart, Bookmark, Users, FileText, Tag } from "lucide-react";
import StockTicker from "@/components/StockTicker";
import { useDashboardStats } from "@/hooks/useDashboardStats";

const AdminDashboard = () => {
  const stats = useDashboardStats();
  
  // Make sure we scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  if (stats.isLoading) {
    return (
      <AdminLayout activeTab="dashboard">
        <div className="p-6">
          <div className="flex flex-col gap-4">
            {/* Loading skeletons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-2/3"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (stats.isError) {
    return (
      <AdminLayout activeTab="dashboard">
        <div className="p-6">
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2 text-red-600">Erro ao carregar dados</h3>
            <p className="text-gray-500">Não foi possível carregar as estatísticas do dashboard. Tente novamente mais tarde.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeTab="dashboard">
      <div className="w-full border-b border-gray-200 mb-4">
        <StockTicker />
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-500">Bem-vindo ao painel administrativo de notícias financeiras.</p>
        </div>
        
        {/* Growth metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          <GrowthMetrics
            title="Total de Visualizações"
            value={`${(stats.totalViews / 1000).toFixed(1)}k`}
            change={stats.viewsChange}
            icon={<Eye size={20} />}
            description="vs. mês anterior"
          />
          <GrowthMetrics
            title="Curtidas em Artigos"
            value={stats.totalLikes.toString()}
            change={stats.likesChange}
            icon={<Heart size={20} />}
            description="vs. mês anterior"
          />
          <GrowthMetrics
            title="Artigos Salvos"
            value={stats.totalSaves.toString()}
            change={stats.savesChange}
            icon={<Bookmark size={20} />}
            description="vs. mês anterior"
          />
          <GrowthMetrics
            title="Novos Assinantes"
            value={stats.totalSubscribers.toString()}
            change={stats.subscribersChange}
            icon={<Users size={20} />}
            description="vs. mês anterior"
          />
          <GrowthMetrics
            title="Total de Artigos"
            value={stats.totalArticles.toString()}
            change={0}
            icon={<FileText size={20} />}
            description="total do sistema"
          />
          <GrowthMetrics
            title="Total de Categorias"
            value={stats.totalCategories.toString()}
            change={0}
            icon={<Tag size={20} />}
            description="total do sistema"
          />
        </div>
        
        {/* Charts section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <MetricsChart
            title="Visualizações Mensais"
            description="Número de visualizações por mês"
            data={stats.monthlyViewsData}
            dataKey="views"
            nameKey="name"
          />
          <MetricsChart
            title="Visualizações Anuais"
            description="Número de visualizações por ano"
            data={stats.yearlyViewsData}
            dataKey="views"
            nameKey="name"
          />
        </div>
        
        {/* Articles ranking section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <PopularArticles 
            title="Artigos Mais Vistos" 
            description="Top 5 artigos com maior número de visualizações"
            articles={stats.articlesByViews}
            type="views"
            icon={Eye}
          />
          <PopularArticles 
            title="Artigos Mais Curtidos" 
            description="Top 5 artigos com maior número de curtidas"
            articles={stats.articlesByLikes}
            type="likes"
            icon={Heart}
          />
        </div>
        
        {/* Saved articles section */}
        <div className="mb-6">
          <SavedArticles 
            title="Artigos Mais Salvos" 
            description="Principais artigos que os usuários salvaram para ler depois"
            articles={stats.mostSavedArticles}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
