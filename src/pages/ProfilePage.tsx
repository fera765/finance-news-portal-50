
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NewsItem } from "@/components/NewsCard";
import { format } from "date-fns";

// Mock saved/liked articles
const mockSavedArticles: NewsItem[] = [
  {
    id: "1",
    title: "Federal Reserve Signals Possible Interest Rate Cuts in Coming Months",
    summary: "Central bank officials indicate a shift in monetary policy as inflation eases.",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
    category: "Economy",
    publishedDate: "2025-05-05T14:30:00Z",
    author: "Michael Stevens"
  },
  {
    id: "2",
    title: "Global Markets Rally as Trade Tensions Ease Between Major Economies",
    summary: "Asian and European markets see significant gains following announcement of new trade agreements.",
    imageUrl: "https://images.unsplash.com/photo-1460472178825-e5240623afd5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
    category: "Markets",
    publishedDate: "2025-05-04T10:15:00Z",
    author: "Sarah Johnson"
  }
];

const mockLikedArticles: NewsItem[] = [
  {
    id: "3",
    title: "Tech Giant Unveils Revolutionary AI-Powered Financial Analysis Platform",
    summary: "New platform promises to transform investment strategies with advanced predictive analytics.",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
    category: "Technology",
    publishedDate: "2025-05-03T16:45:00Z",
    author: "David Wong"
  }
];

const ProfilePage = () => {
  const [user, setUser] = useState({
    id: "user-1",
    name: "John Doe",
    email: "john.doe@example.com",
    joinDate: "2024-12-15T10:30:00Z"
  });
  
  const [savedArticles, setSavedArticles] = useState<NewsItem[]>([]);
  const [likedArticles, setLikedArticles] = useState<NewsItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email
  });
  
  useEffect(() => {
    // In a real app, fetch user data and saved/liked articles from API
    setSavedArticles(mockSavedArticles);
    setLikedArticles(mockLikedArticles);
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveProfile = () => {
    // In a real app, save profile data to API
    setUser(prev => ({ ...prev, name: formData.name, email: formData.email }));
    setIsEditing(false);
  };
  
  const handleRemoveArticle = (id: string, type: 'saved' | 'liked') => {
    if (type === 'saved') {
      setSavedArticles(prev => prev.filter(article => article.id !== id));
    } else {
      setLikedArticles(prev => prev.filter(article => article.id !== id));
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="saved">Saved Articles</TabsTrigger>
            <TabsTrigger value="liked">Liked Articles</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Account Information</h2>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>
                
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <Button onClick={handleSaveProfile}>
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">{user.name}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Member Since</p>
                        <p className="font-medium">{format(new Date(user.joinDate), "MMMM d, yyyy")}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-semibold mb-2">Account Security</h3>
                      <Button variant="outline">Change Password</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="saved">
            <h2 className="text-xl font-semibold mb-4">Saved Articles</h2>
            {savedArticles.length > 0 ? (
              <div className="space-y-4">
                {savedArticles.map(article => (
                  <Card key={article.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/4 h-40 md:h-auto">
                        <img 
                          src={article.imageUrl} 
                          alt={article.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4 md:w-3/4 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <div className="flex items-center">
                                <span className="bg-finance-100 text-finance-800 text-xs px-2 py-1 rounded">
                                  {article.category}
                                </span>
                                <span className="mx-2 text-gray-400">•</span>
                                <span className="text-sm text-gray-500">
                                  {format(new Date(article.publishedDate), "MMM d, yyyy")}
                                </span>
                              </div>
                              <h3 className="font-bold text-lg">
                                <a href={`/news/${article.id}`} className="hover:text-finance-600">
                                  {article.title}
                                </a>
                              </h3>
                              <p className="text-gray-600 text-sm">{article.summary}</p>
                            </div>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleRemoveArticle(article.id, 'saved')}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">By {article.author}</p>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500 mb-4">You haven't saved any articles yet.</p>
                  <Button asChild>
                    <a href="/">Browse Articles</a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="liked">
            <h2 className="text-xl font-semibold mb-4">Liked Articles</h2>
            {likedArticles.length > 0 ? (
              <div className="space-y-4">
                {likedArticles.map(article => (
                  <Card key={article.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/4 h-40 md:h-auto">
                        <img 
                          src={article.imageUrl} 
                          alt={article.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4 md:w-3/4 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <div className="flex items-center">
                                <span className="bg-finance-100 text-finance-800 text-xs px-2 py-1 rounded">
                                  {article.category}
                                </span>
                                <span className="mx-2 text-gray-400">•</span>
                                <span className="text-sm text-gray-500">
                                  {format(new Date(article.publishedDate), "MMM d, yyyy")}
                                </span>
                              </div>
                              <h3 className="font-bold text-lg">
                                <a href={`/news/${article.id}`} className="hover:text-finance-600">
                                  {article.title}
                                </a>
                              </h3>
                              <p className="text-gray-600 text-sm">{article.summary}</p>
                            </div>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleRemoveArticle(article.id, 'liked')}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">By {article.author}</p>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500 mb-4">You haven't liked any articles yet.</p>
                  <Button asChild>
                    <a href="/">Browse Articles</a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ProfilePage;
