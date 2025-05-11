
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Zap, Users, FileText, TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import GrowthMetrics from "@/components/admin/GrowthMetrics";
import PopularArticles, { ArticleSummary } from "@/components/admin/PopularArticles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for admin dashboard
const mockStats = {
  articles: {
    current: 54,
    previous: 42,
  },
  users: {
    current: 1250,
    previous: 1100,
  },
  views: {
    current: 25600,
    previous: 19800,
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

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleNewArticle = () => {
    navigate("/admin/articles");
    toast({
      title: "Create Article",
      description: "Redirecting to articles management page.",
    });
  };

  return (
    <AdminLayout activeTab="dashboard">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back, Admin User</p>
        </div>
        <Button onClick={handleNewArticle} className="gap-2 shadow-sm">
          <PlusCircle className="h-5 w-5" />
          New Article
        </Button>
      </div>
      
      {/* Growth Metrics */}
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-4">Growth Metrics</h2>
        <GrowthMetrics
          articlesCount={mockStats.articles.current}
          previousArticlesCount={mockStats.articles.previous}
          usersCount={mockStats.users.current}
          previousUsersCount={mockStats.users.previous}
          viewsCount={mockStats.views.current}
          previousViewsCount={mockStats.views.previous}
        />
      </div>
      
      {/* Popular Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <PopularArticles
          title="Most Viewed Articles"
          description="Articles with the highest number of views"
          articles={mockMostViewedArticles}
          type="views"
        />
        
        <PopularArticles
          title="Most Liked Articles"
          description="Articles with the highest number of likes"
          articles={mockMostLikedArticles}
          type="likes"
        />
      </div>
      
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Articles</span>
              <FileText className="h-5 w-5 text-finance-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-4">{mockStats.articles.current}</div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-green-50 p-2 rounded">
                <div className="text-sm text-gray-500">Published</div>
                <div className="text-xl font-medium">42</div>
              </div>
              <div className="bg-yellow-50 p-2 rounded">
                <div className="text-sm text-gray-500">Draft</div>
                <div className="text-xl font-medium">8</div>
              </div>
              <div className="bg-blue-50 p-2 rounded">
                <div className="text-sm text-gray-500">Scheduled</div>
                <div className="text-xl font-medium">4</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Users</span>
              <Users className="h-5 w-5 text-finance-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-4">{mockStats.users.current}</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-green-50 p-2 rounded">
                <div className="text-sm text-gray-500">Active</div>
                <div className="text-xl font-medium">1240</div>
              </div>
              <div className="bg-red-50 p-2 rounded">
                <div className="text-sm text-gray-500">Banned</div>
                <div className="text-xl font-medium">10</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Activity Today</span>
              <Calendar className="h-5 w-5 text-finance-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-4">67</div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-blue-50 p-2 rounded">
                <div className="text-sm text-gray-500">Articles</div>
                <div className="text-xl font-medium">12</div>
              </div>
              <div className="bg-purple-50 p-2 rounded">
                <div className="text-sm text-gray-500">Comments</div>
                <div className="text-xl font-medium">28</div>
              </div>
              <div className="bg-amber-50 p-2 rounded">
                <div className="text-sm text-gray-500">Sign-ups</div>
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
              <span>Performance Overview</span>
              <TrendingUp className="h-5 w-5 text-finance-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-md border border-dashed border-gray-300">
              <span className="text-gray-500">Chart Component Here</span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="text-sm text-gray-500">Page Views</div>
                <div className="text-xl font-medium">24.5k</div>
                <div className="text-xs text-green-600">+12%</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">Avg. Time</div>
                <div className="text-xl font-medium">2m 45s</div>
                <div className="text-xs text-green-600">+8%</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">Bounce Rate</div>
                <div className="text-xl font-medium">42%</div>
                <div className="text-xs text-red-600">+3%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span>Server Status</span>
              <Zap className="h-5 w-5 text-finance-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">API Health</div>
                  <div className="text-sm text-gray-500">Last checked 5 minutes ago</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium text-green-600">Operational</span>
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
                  <div className="text-sm text-gray-500">Memory</div>
                  <div className="text-xl font-medium">36%</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                  <div className="text-sm text-gray-500">Disk</div>
                  <div className="text-xl font-medium">24%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
