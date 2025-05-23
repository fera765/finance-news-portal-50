import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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
import { trackArticleView, getArticleViews } from "@/services/viewsService";
import DOMPurify from "dompurify";
import { marked } from "marked";
import RelatedNewsCarousel from "@/components/RelatedNewsCarousel";

const NewsDetail = () => {
  const { id, slug } = useParams<{ id: string, slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [parsedContent, setParsedContent] = useState("");
  const [viewCount, setViewCount] = useState<number>(0);
  const [viewTracked, setViewTracked] = useState(false);

  // Buscar dados do artigo
  const { data: article, isLoading, isError } = useArticleBySlug(slug);
  
  // Buscar categorias e usuários para obter nomes em vez de IDs
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });

  const { data: authors = [] } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  });
  
  // Encontrar nomes de categoria e autor com base em seus IDs
  const categoryName = categories.find(cat => cat.id === article?.category)?.name || "Sem categoria";
  const authorName = authors.find(auth => auth.id === article?.author)?.name || "Autor desconhecido";
  
  // Gerenciar interações do artigo (curtidas, favoritos, visualizações)
  const { 
    isLiked, 
    isBookmarked, 
    handleLike, 
    handleBookmark,
    likeLoading,
    bookmarkLoading,
    pendingAction
  } = useArticleInteractions(article?.id);
  
  // Gerenciar comentários
  const {
    comments,
    addComment
  } = useComments(article?.id);

  // Rastrear visualização do artigo
  useEffect(() => {
    const fetchViewCount = async () => {
      if (article?.id && !viewTracked) {
        try {
          // Rastrear a visualização
          await trackArticleView(article.id);
          setViewTracked(true);
          
          // Obter a contagem de visualizações atualizada
          const count = await getArticleViews(article.id);
          setViewCount(count);
        } catch (error) {
          console.error('Erro ao rastrear visualização do artigo:', error);
        }
      }
    };
    
    fetchViewCount();
  }, [article?.id, viewTracked]);

  // Analisar conteúdo de Markdown quando o artigo carrega ou muda
  useEffect(() => {
    if (article?.content) {
      try {
        // Fix: Usar marked.parse diretamente com a string de conteúdo
        const rawHtml = marked.parse(article.content, { async: false }) as string;
        // Limpar o HTML para evitar ataques XSS
        const sanitizedHtml = DOMPurify.sanitize(rawHtml);
        setParsedContent(sanitizedHtml);
      } catch (error) {
        console.error("Erro ao analisar conteúdo markdown:", error);
        // Voltar ao conteúdo bruto se a análise falhar
        setParsedContent(article.content);
      }
    } else {
      setParsedContent("");
    }
  }, [article]);

  // Redirecionar se o slug não corresponder ao artigo
  useEffect(() => {
    if (article && article.id && article.slug !== slug) {
      navigate(`/news/${article.id}/${article.slug}`, { replace: true });
    }
  }, [article, slug, navigate]);

  // Processar interações pendentes após login
  useEffect(() => {
    if (user && pendingAction) {
      console.log("Processando ação pendente:", pendingAction);
      // Os hooks processarão isso automaticamente
    }
  }, [user, pendingAction]);

  // Configurar meta tags para compartilhamento nas redes sociais
  useEffect(() => {
    if (article) {
      // Adicionar ou atualizar Open Graph meta tags
      const addOrUpdateMetaTag = (property: string, content: string) => {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', property);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      // Definir Open Graph meta tags
      addOrUpdateMetaTag('og:title', article.title);
      addOrUpdateMetaTag('og:description', article.summary || '');
      addOrUpdateMetaTag('og:url', window.location.href);
      addOrUpdateMetaTag('og:type', 'article');
      if (article.imageUrl) {
        addOrUpdateMetaTag('og:image', article.imageUrl);
      }

      // Limpar meta tags ao desmontar o componente
      return () => {
        const metaTags = ['og:title', 'og:description', 'og:url', 'og:type', 'og:image'];
        metaTags.forEach(tag => {
          const meta = document.querySelector(`meta[property="${tag}"]`);
          if (meta) document.head.removeChild(meta);
        });
      };
    }
  }, [article]);

  const handleShare = async () => {
    if (!article) return;
    
    // Tentar usar a API Web Share se disponível
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary || '',
          url: window.location.href,
        });
        
        toast.success("Artigo compartilhado com sucesso");
        return;
      } catch (error) {
        console.error("Erro ao compartilhar:", error);
      }
    }
    
    // Voltar para a área de transferência se a API Web Share não estiver disponível
    try {
      await navigator.clipboard.writeText(window.location.href);
      
      toast.success("Link copiado para a área de transferência", {
        description: "Você pode compartilhar este artigo nas redes sociais"
      });
    } catch (error) {
      console.error("Falha ao copiar:", error);
      
      toast.error("Não foi possível copiar o link", {
        description: "Tente selecionar o URL na barra de endereço"
      });
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

  // Mapear artigos relacionados (precisaria de suporte adicional de API)
  const related: NewsItem[] = []; // Em um aplicativo real, você buscaria artigos relacionados

  return (
    <Layout openAuthModal={isAuthModalOpen}>
      {/* Ticker de Ações */}
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
              {article.publishDate && format(new Date(article.publishDate), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </div>
          </div>
          <div className="flex items-center">
            <Eye size={16} className="mr-1 text-gray-500" />
            <span>{viewCount} visualizações</span>
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
        
        {/* Notícias Relacionadas */}
        <RelatedNewsCarousel articleId={article.id || ''} categoryId={article.category} tags={article.tags} />
        
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
