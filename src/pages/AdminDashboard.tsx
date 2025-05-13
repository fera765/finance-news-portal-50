import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import GrowthMetrics from "@/components/admin/GrowthMetrics";
import MetricsChart from "@/components/admin/MetricsChart";
import PopularArticles from "@/components/admin/PopularArticles";
import SavedArticles from "@/components/admin/SavedArticles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Heart, Bookmark } from "lucide-react";
import { ArticleSummary } from "@/components/admin/PopularArticles";
import StockTicker from "@/components/StockTicker";

const AdminDashboard = () => {
  const [monthlyViews, setMonthlyViews] = useState([]);
  const [yearlyViews, setYearlyViews] = useState([]);
  const [topArticlesByViews, setTopArticlesByViews] = useState<ArticleSummary[]>([]);
  const [topArticlesByLikes, setTopArticlesByLikes] = useState<ArticleSummary[]>([]);
  const [savedArticles, setSavedArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, these would be API calls
    const fetchDashboardData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Monthly views data for chart
        const mockMonthlyData = [
          { name: "Jan", views: 1200 },
          { name: "Feb", views: 1900 },
          { name: "Mar", views: 2100 },
          { name: "Apr", views: 2400 },
          { name: "May", views: 3200 }
        ];
        
        // Yearly views data for chart
        const mockYearlyData = [
          { name: "2021", views: 12000 },
          { name: "2022", views: 19000 },
          { name: "2023", views: 24000 },
          { name: "2024", views: 28000 },
          { name: "2025", views: 15000 }
        ];
        
        // Fetch most viewed articles
        const mockTopViewedArticles = [
          {
            id: "1",
            title: "Federal Reserve Signals Possible Interest Rate Cuts in Coming Months",
            category: "Economy",
            publishedDate: "2025-05-05T14:30:00Z",
            views: 1245,
            likes: 87,
            bookmarks: 45,
            slug: "federal-reserve-signals-possible-interest-rate-cuts"
          },
          {
            id: "2",
            title: "Global Markets Rally as Trade Tensions Ease Between Major Economies",
            category: "Markets",
            publishedDate: "2025-05-04T10:15:00Z",
            views: 876,
            likes: 56,
            bookmarks: 32,
            slug: "global-markets-rally-as-trade-tensions-ease"
          },
          {
            id: "3",
            title: "Tech Giant Unveils Revolutionary AI-Powered Financial Analysis Platform",
            category: "Technology",
            publishedDate: "2025-05-03T16:45:00Z",
            views: 765,
            likes: 92,
            bookmarks: 61,
            slug: "tech-giant-unveils-revolutionary-ai-powered-financial-analysis-platform"
          },
          {
            id: "4",
            title: "Cryptocurrency Market Faces Regulatory Challenges in Major Economies",
            category: "Cryptocurrency",
            publishedDate: "2025-05-05T09:20:00Z",
            views: 682,
            likes: 43,
            bookmarks: 28,
            slug: "cryptocurrency-market-faces-regulatory-challenges"
          },
          {
            id: "5",
            title: "Oil Prices Stabilize Following Middle East Production Agreement",
            category: "Commodities",
            publishedDate: "2025-05-04T18:00:00Z",
            views: 587,
            likes: 35,
            bookmarks: 19,
            slug: "oil-prices-stabilize-following-middle-east-production-agreement"
          }
        ];
        
        // Fetch most liked articles
        const mockTopLikedArticles = [
          {
            id: "3",
            title: "Tech Giant Unveils Revolutionary AI-Powered Financial Analysis Platform",
            category: "Technology",
            publishedDate: "2025-05-03T16:45:00Z",
            views: 765,
            likes: 92,
            bookmarks: 61,
            slug: "tech-giant-unveils-revolutionary-ai-powered-financial-analysis-platform"
          },
          {
            id: "1",
            title: "Federal Reserve Signals Possible Interest Rate Cuts in Coming Months",
            category: "Economy",
            publishedDate: "2025-05-05T14:30:00Z",
            views: 1245,
            likes: 87,
            bookmarks: 45,
            slug: "federal-reserve-signals-possible-interest-rate-cuts"
          },
          {
            id: "2",
            title: "Global Markets Rally as Trade Tensions Ease Between Major Economies",
            category: "Markets",
            publishedDate: "2025-05-04T10:15:00Z",
            views: 876,
            likes: 56,
            bookmarks: 32,
            slug: "global-markets-rally-as-trade-tensions-ease"
          },
          {
            id: "4",
            title: "Cryptocurrency Market Faces Regulatory Challenges in Major Economies",
            category: "Cryptocurrency",
            publishedDate: "2025-05-05T09:20:00Z",
            views: 682,
            likes: 43,
            bookmarks: 28,
            slug: "cryptocurrency-market-faces-regulatory-challenges"
          },
          {
            id: "5",
            title: "Oil Prices Stabilize Following Middle East Production Agreement",
            category: "Commodities",
            publishedDate: "2025-05-04T18:00:00Z",
            views: 587,
            likes: 35,
            bookmarks: 19,
            slug: "oil-prices-stabilize-following-middle-east-production-agreement"
          }
        ];
        
        // Fetch saved articles
        const mockSavedArticles = [
          {
            id: "3",
            title: "Tech Giant Unveils Revolutionary AI-Powered Financial Analysis Platform",
            category: "Technology",
            views: 765,
            bookmarks: 61,
            createdAt: "2025-05-03T16:45:00Z"
          },
          {
            id: "1",
            title: "Federal Reserve Signals Possible Interest Rate Cuts in Coming Months",
            category: "Economy",
            views: 1245,
            bookmarks: 45,
            createdAt: "2025-05-05T14:30:00Z"
          },
          {
            id: "2",
            title: "Global Markets Rally as Trade Tensions Ease Between Major Economies",
            category: "Markets",
            views: 876,
            bookmarks: 32,
            createdAt: "2025-05-04T10:15:00Z"
          }
        ];
        
        setMonthlyViews(mockMonthlyData);
        setYearlyViews(mockYearlyData);
        setTopArticlesByViews(mockTopViewedArticles);
        setTopArticlesByLikes(mockTopLikedArticles);
        setSavedArticles(mockSavedArticles);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  if (loading) {
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

  return (
    <AdminLayout activeTab="dashboard">
      <div className="w-full border-b border-gray-200 mb-4">
        <StockTicker />
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-500">Welcome to your finance news admin dashboard.</p>
        </div>
        
        {/* Growth metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <GrowthMetrics
            title="Total Views"
            value="32.5k"
            change={12.3}
            icon={<Eye size={20} />}
            description="vs. previous month"
          />
          <GrowthMetrics
            title="Article Likes"
            value="1,203"
            change={8.1}
            icon={<Heart size={20} />}
            description="vs. previous month"
          />
          <GrowthMetrics
            title="Article Saves"
            value="845"
            change={-3.2}
            icon={<Bookmark size={20} />}
            description="vs. previous month"
          />
          <GrowthMetrics
            title="New Subscribers"
            value="267"
            change={24.5}
            description="vs. previous month"
          />
        </div>
        
        {/* Charts section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <MetricsChart
            title="Monthly Page Views"
            description="Number of page views per month"
            data={monthlyViews}
            dataKey="views"
            nameKey="name"
          />
          <MetricsChart
            title="Yearly Page Views"
            description="Number of page views per year"
            data={yearlyViews}
            dataKey="views"
            nameKey="name"
          />
        </div>
        
        {/* Articles ranking section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <PopularArticles 
            title="Most Viewed Articles" 
            description="Top 5 articles with the highest number of views"
            articles={topArticlesByViews}
            type="views"
            icon={Eye}
          />
          <PopularArticles 
            title="Most Liked Articles" 
            description="Top 5 articles with the highest number of likes"
            articles={topArticlesByLikes}
            type="likes"
            icon={Heart}
          />
        </div>
        
        {/* Saved articles section */}
        <div className="mb-6">
          <SavedArticles 
            title="Most Saved Articles" 
            description="Top articles that users have saved to read later"
            articles={savedArticles}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
