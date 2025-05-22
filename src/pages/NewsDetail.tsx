import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import Layout from "@/components/Layout";
import CommentSection from "@/components/CommentSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Heart, Share, Eye, Bookmark } from "lucide-react";
import { NewsItem } from "@/components/NewsCard";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import StockTicker from "@/components/StockTicker";
import { useArticleBySlug } from "@/hooks/useNews";
import { useArticleInteractions } from "@/hooks/useArticleInteractions";
import { useComments } from "@/hooks/useComments";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/categoryService";
import { getUsers } from "@/services/userService";
import DOMPurify from "dompurify";
import { marked } from "marked";

const NewsDetail = () => {
  const { id, slug } = useParams<{ id: string, slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [parsedContent, setParsedContent] = useState("");

  // Fetch article data
  const { data: article, isLoading, isError } = useArticleBySlug(slug);
  
  // Fetch categories and users to get names instead of IDs
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });

  const { data: authors = [] } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  });
  
  // Find category and author names based on their IDs
  const categoryName = categories.find(cat => cat.id === article?.category)?.name || "Sem categoria";
  const authorName = authors.find(auth => auth.id === article?.author)?.name || "Autor desconhecido";
  
  // Handle article interactions (likes, bookmarks, views)
  const { 
    isLiked, 
    isBookmarked, 
    handleLike, 
    handleBookmark,
    likeLoading,
    bookmarkLoading,
    pendingAction
  } = useArticleInteractions(article?.id);
  
  // Handle comments
  const {
    comments,
    addComment
  } = useComments(article?.id);

  // Parse Markdown content when article loads or changes
  useEffect(() => {
    if (article?.content) {
      try {
        // Fix: Use marked.parse directly with the content string
        const rawHtml = marked.parse(article.content, { async: false }) as string;
        // Sanitize the HTML to prevent XSS attacks
        const sanitizedHtml = DOMPurify.sanitize(rawHtml);
        setParsedContent(sanitizedHtml);
      } catch (error) {
        console.error("Error parsing markdown content:", error);
        // Fallback to raw content if parsing fails
        setParsedContent(article.content);
      }
    } else {
      setParsedContent("");
    }
  }, [article]);

  // Redirect if slug doesn't match the article
  useEffect(() => {
    if (article && article.id && article.slug !== slug) {
      navigate(`/news/${article.id}/${article.slug}`, { replace: true });
    }
  }, [article, slug, navigate]);

  // Process any pending interactions after login
  useEffect(() => {
    if (user && pendingAction) {
      console.log("Processing pending action:", pendingAction);
      // The hooks will handle this automatically
    }
  }, [user, pendingAction]);

  const handleShare = async () => {
    if (!article) return;
    
    // Try to use the Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary || '',
          url: window.location.href,
        });
        
        toast("Article shared successfully");
        return;
      } catch (error) {
        console.error("Error sharing:", error);
      }
    }
    
    // Fallback to clipboard if Web Share API is not available
    try {
      await navigator.clipboard.writeText(window.location.href);
      
      toast("Article link copied to clipboard");
    } catch (error) {
      console.error("Failed to copy:", error);
      
      toast("Could not copy the link to clipboard");
    }
  };
  
  const handleLogin = () => {
    setIsAuthModalOpen(true);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 border-4 border-t-blue-500 border-b-blue-300 rounded-full animate-spin"></div>
            <p className="text-gray-600">Carregando artigo...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (isError || !article) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Artigo não encontrado</h1>
          <p className="mb-6">Desculpe, o artigo que você procura não existe ou foi removido.</p>
          <Button onClick={() => navigate("/")}>Voltar para a Página Inicial</Button>
        </div>
      </Layout>
    );
  }

  // Map related articles (would need additional API support)
  const related: NewsItem[] = []; // In a real app, you'd fetch related articles

  return (
    <Layout openAuthModal={isAuthModalOpen}>
      {/* Stock Ticker */}
      <div className="w-full border-b border-gray-200 mb-4">
        <div className="container mx-auto">
          <StockTicker />
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-4 md:py-8 max-w-5xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-4 md:mb-6 flex items-center text-gray-600 hover:text-finance-700"
        >
          <ChevronLeft size={20} className="mr-1" />
          Voltar
        </Button>
        
        <div className="mb-4 flex flex-wrap gap-2">
          <Link to={`/category/${categories.find(cat => cat.id === article.category)?.slug || ''}`}>
            <Badge className="bg-finance-700 hover:bg-finance-800 cursor-pointer">{categoryName}</Badge>
          </Link>
          {article.tags?.map((tag) => (
            <Badge key={tag} variant="outline" className="bg-gray-100">
              {tag}
            </Badge>
          ))}
        </div>
        
        <h1 className="text-2xl md:text-4xl font-bold mb-4">{article.title}</h1>
        
        <div className="flex items-center justify-between text-gray-500 mb-6 flex-wrap gap-y-2">
          <div className="flex items-center flex-wrap">
            <div className="mr-4">
              Por <span className="font-medium text-gray-700">{authorName}</span>
            </div>
            <div>
              {article.publishDate && format(new Date(article.publishDate), "d 'de' MMMM 'de' yyyy")}
            </div>
          </div>
        </div>
        
        <div className="mb-6 md:mb-8">
          <img 
            src={article.imageUrl || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'} 
            alt={article.title} 
            className="w-full h-auto rounded-lg" 
          />
        </div>
        
        <div className="flex gap-3 mb-6 flex-wrap">
          <Button
            variant={isLiked ? "default" : "outline"}
            className={`flex items-center gap-2 ${isLiked ? "bg-finance-600 hover:bg-finance-700" : ""}`}
            onClick={() => {
              if (!handleLike()) {
                handleLogin();
              }
            }}
            disabled={likeLoading}
          >
            <Heart size={16} fill={isLiked ? "white" : "none"} 
              className={likeLoading ? "animate-pulse" : ""} />
            {isLiked ? "Curtido" : "Curtir"}
          </Button>
          
          <Button
            variant={isBookmarked ? "default" : "outline"}
            className={`flex items-center gap-2 ${isBookmarked ? "bg-finance-600 hover:bg-finance-700" : ""}`}
            onClick={() => {
              if (!handleBookmark()) {
                handleLogin();
              }
            }}
            disabled={bookmarkLoading}
          >
            <Bookmark size={16} fill={isBookmarked ? "white" : "none"}
              className={bookmarkLoading ? "animate-pulse" : ""} />
            {isBookmarked ? "Salvo" : "Salvar"}
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleShare}
          >
            <Share size={16} />
            Compartilhar
          </Button>
        </div>
        
        <div 
          className="news-content mb-8 md:mb-10 prose prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: parsedContent }} 
        />
        
        {related.length > 0 && (
          <div className="mb-8 md:mb-10">
            <h3 className="text-xl font-bold mb-4">Artigos Relacionados</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {related.map((article) => (
                <div key={article.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <Link to={`/news/${article.id}/${article.slug}`} className="flex h-32">
                    <div className="w-1/3">
                      <img 
                        src={article.imageUrl} 
                        alt={article.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-2/3 p-3">
                      <Badge className="mb-2 text-xs" variant="outline">{article.category}</Badge>
                      <h4 className="font-semibold text-sm line-clamp-2 mb-1">{article.title}</h4>
                      <p className="text-gray-500 text-xs">
                        {format(new Date(article.publishedDate), "d MMM, yyyy")}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="border-t border-gray-200 pt-6 md:pt-10">
          <CommentSection 
            newsId={article.id || ''}
            comments={comments || []}
            onLogin={handleLogin}
            currentUser={user}
          />
        </div>
      </div>
    </Layout>
  );
};

export default NewsDetail;
