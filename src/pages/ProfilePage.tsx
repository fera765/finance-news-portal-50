
import { Navigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { NewsItem } from "@/components/NewsCard";
import { useAuth } from "@/hooks/useAuth";
import { useUserArticles } from "@/hooks/useUserArticles";
import { Loader2 } from "lucide-react";

const ArticleList = ({ articles, isLoading }: { articles: NewsItem[], isLoading: boolean }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
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
              <Link to={`/category/${article.categorySlug || article.category.toLowerCase().replace(/\s+/g, '-')}`}>
                <Badge className="mb-2 hover:bg-primary cursor-pointer">{article.category}</Badge>
              </Link>
              <Link to={`/news/${article.id}/${article.slug}`}>
                <h3 className="text-lg font-bold mb-2 hover:text-primary">{article.title}</h3>
              </Link>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{article.summary}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{format(new Date(article.publishedDate), "MMMM d, yyyy")}</span>
                <span>{article.author}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
      
      {!isLoading && articles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum artigo encontrado</p>
        </div>
      )}
    </div>
  );
};

const ProfilePage = () => {
  const { user } = useAuth();
  const { savedArticles, likedArticles, isLoading } = useUserArticles();
  
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
                  <div className="text-2xl font-bold">{savedArticles.length}</div>
                  <div className="text-sm text-gray-500">Saved Articles</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{likedArticles.length}</div>
                  <div className="text-sm text-gray-500">Liked Articles</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Member since {user.id ? format(new Date(), "MMMM yyyy") : ""}
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
            <ArticleList articles={savedArticles} isLoading={isLoading} />
          </TabsContent>
          
          <TabsContent value="liked" className="space-y-4">
            <h2 className="text-xl font-bold">Liked Articles</h2>
            <Separator className="my-4" />
            <ArticleList articles={likedArticles} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ProfilePage;
