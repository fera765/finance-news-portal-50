import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { NewsItem } from "@/components/NewsCard";
import { User } from "@/components/Layout";

// Mock data for saved articles
const mockSavedArticles: NewsItem[] = [
  {
    id: "1",
    title: "Federal Reserve Signals Possible Interest Rate Cuts in Coming Months",
    summary: "Central bank officials indicate a shift in monetary policy as inflation eases and economic growth stabilizes.",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
    category: "Economy",
    publishedDate: "2025-05-05T14:30:00Z",
    author: "Michael Stevens",
    slug: "federal-reserve-signals-possible-interest-rate-cuts"
  },
  {
    id: "3",
    title: "Tech Giant Unveils Revolutionary AI-Powered Financial Analysis Platform",
    summary: "New platform promises to transform investment strategies with advanced predictive analytics.",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
    category: "Technology",
    publishedDate: "2025-05-03T16:45:00Z",
    author: "David Wong",
    slug: "tech-giant-unveils-revolutionary-ai-powered-financial-analysis-platform"
  }
];

// Mock data for liked articles
const mockLikedArticles: NewsItem[] = [
  {
    id: "2",
    title: "Global Markets Rally as Trade Tensions Ease Between Major Economies",
    summary: "Asian and European markets see significant gains following announcement of new trade agreements.",
    imageUrl: "https://images.unsplash.com/photo-1460472178825-e5240623afd5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
    category: "Markets",
    publishedDate: "2025-05-04T10:15:00Z",
    author: "Sarah Johnson",
    slug: "global-markets-rally-as-trade-tensions-ease"
  },
  {
    id: "5",
    title: "Oil Prices Stabilize Following Middle East Production Agreement",
    summary: "Major oil-producing nations reach consensus on output levels, bringing stability to global energy markets.",
    imageUrl: "https://images.unsplash.com/photo-1582486225644-dab37c8b1d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
    category: "Commodities",
    publishedDate: "2025-05-04T18:00:00Z",
    author: "Robert Martinez",
    slug: "oil-prices-stabilize-following-middle-east-production-agreement"
  },
  {
    id: "1",
    title: "Federal Reserve Signals Possible Interest Rate Cuts in Coming Months",
    summary: "Central bank officials indicate a shift in monetary policy as inflation eases and economic growth stabilizes.",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
    category: "Economy",
    publishedDate: "2025-05-05T14:30:00Z",
    author: "Michael Stevens",
    slug: "federal-reserve-signals-possible-interest-rate-cuts"
  }
];

const ArticleList = ({ articles }: { articles: NewsItem[] }) => {
  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <Card key={article.id} className="overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            <div className="sm:w-1/4">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-40 sm:h-full object-cover"
              />
            </div>
            <div className="p-4 sm:w-3/4">
              <Badge className="mb-2">{article.category}</Badge>
              <h3 className="text-lg font-bold mb-2">{article.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{article.summary}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{format(new Date(article.publishedDate), "MMMM d, yyyy")}</span>
                <span>{article.author}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
      
      {articles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No articles found</p>
        </div>
      )}
    </div>
  );
};

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Check for saved user in localStorage on component mount
    const savedUser = localStorage.getItem("financeNewsUser");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user:", e);
      }
    }
  }, []);
  
  // Redirect to home if no user is logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader className="pb-0">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <div className="text-gray-500 mt-1 flex items-center gap-2 justify-center sm:justify-start">
                  {user.email}
                  <Badge variant="outline" className="ml-2">
                    {user.role === "admin" ? "Administrator" : "User"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <div className="flex gap-6">
                <div>
                  <div className="text-2xl font-bold">{mockSavedArticles.length}</div>
                  <div className="text-sm text-gray-500">Saved Articles</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{mockLikedArticles.length}</div>
                  <div className="text-sm text-gray-500">Liked Articles</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Member since {format(new Date(2025, 0, 15), "MMMM yyyy")}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="saved" className="space-y-4">
          <TabsList>
            <TabsTrigger value="saved">Saved Articles</TabsTrigger>
            <TabsTrigger value="liked">Liked Articles</TabsTrigger>
          </TabsList>
          
          <TabsContent value="saved" className="space-y-4">
            <h2 className="text-xl font-bold">Saved Articles</h2>
            <Separator className="my-4" />
            <ArticleList articles={mockSavedArticles} />
          </TabsContent>
          
          <TabsContent value="liked" className="space-y-4">
            <h2 className="text-xl font-bold">Liked Articles</h2>
            <Separator className="my-4" />
            <ArticleList articles={mockLikedArticles} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ProfilePage;
