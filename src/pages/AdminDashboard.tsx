import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import AdminSidebar from "@/components/admin/AdminSidebar";
import GrowthMetrics from "@/components/admin/GrowthMetrics";
import PopularArticles, { ArticleSummary } from "@/components/admin/PopularArticles";

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
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleNewArticle = () => {
    toast({
      title: "Create Article",
      description: "The article editor will be available in the next version.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Top Navigation */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <h1 className="text-lg font-medium">Dashboard Overview</h1>
              
              <Button onClick={handleNewArticle}>
                <PlusCircle className="h-5 w-5 mr-2" />
                New Article
              </Button>
            </div>
          </div>
        </header>
        
        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Growth Metrics */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Growth Metrics</h2>
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
          
          {/* Rest of dashboard content... */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Articles</h3>
              <div className="text-3xl font-bold">{mockStats.articles.current}</div>
              <div className="grid grid-cols-3 gap-2 mt-4">
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
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Users</h3>
              <div className="text-3xl font-bold">{mockStats.users.current}</div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="bg-green-50 p-2 rounded">
                  <div className="text-sm text-gray-500">Active</div>
                  <div className="text-xl font-medium">1240</div>
                </div>
                <div className="bg-red-50 p-2 rounded">
                  <div className="text-sm text-gray-500">Banned</div>
                  <div className="text-xl font-medium">10</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Comments</h3>
              <div className="text-3xl font-bold">1876</div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="bg-green-50 p-2 rounded">
                  <div className="text-sm text-gray-500">Approved</div>
                  <div className="text-xl font-medium">1812</div>
                </div>
                <div className="bg-yellow-50 p-2 rounded">
                  <div className="text-sm text-gray-500">Pending</div>
                  <div className="text-xl font-medium">28</div>
                </div>
                <div className="bg-red-50 p-2 rounded">
                  <div className="text-sm text-gray-500">Rejected</div>
                  <div className="text-xl font-medium">36</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
