
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import NewsCard, { NewsItem } from "@/components/NewsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StockTicker from "@/components/StockTicker";
import { useDetachArticles, useNonDetachArticles } from "@/hooks/useNews";
import { Article } from "@/services/articleService";
import { useNewsletter } from "@/hooks/useNewsletter";
import { FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCategories, Category } from "@/services/categoryService";
import { getUsers } from "@/services/userService";
import { User } from "@/components/Layout";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useInView } from "react-intersection-observer";
import FeaturedNewsSection from "@/components/FeaturedNewsSection";

// Convert API article to NewsItem format - Com verificações de dados e busca de nomes
const mapArticleToNewsItem = (article: Article, categories: Category[] = [], authors: User[] = []): NewsItem => {
  // Encontrar nome da categoria baseado no ID
  const categoryName = categories.find(cat => cat.id === article.category)?.name || 'Geral';
  const categorySlug = categories.find(cat => cat.id === article.category)?.slug || '';
  
  // Encontrar nome do autor baseado no ID
  const authorName = authors.find(auth => auth.id === article.author)?.name || 'Equipe Editorial';
  
  return {
    id: article.id || crypto.randomUUID(), // Garante ID único
    title: article.title || "Sem título",
    summary: article.summary || 'Sem resumo disponível',
    imageUrl: article.imageUrl || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    category: categoryName,
    categoryId: article.category,
    categorySlug: categorySlug,
    publishedDate: typeof article.publishDate === 'object' && article.publishDate instanceof Date 
      ? article.publishDate.toISOString() 
      : String(article.publishDate) || new Date().toISOString(),
    author: authorName,
    slug: article.slug || `artigo-${article.id || crypto.randomUUID()}`
  };
};

const Index = () => {
  const [initialArticlesLoaded, setInitialArticlesLoaded] = useState(6);
  const { ref, inView } = useInView();
  
  // Newsletter state com hook
  const { email, setEmail, isLoading: isNewsletterLoading, handleSubscribe } = useNewsletter();
  
  // Buscar categorias e autores para exibir nomes em vez de IDs
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });
  
  const { data: authors = [] } = useQuery({
    queryKey: ['authors'],
    queryFn: getUsers
  });
  
  // Use separate hooks to fetch detach and non-detach articles
  const { 
    data: detachArticles = [], 
    isLoading: detachLoading,
    isError: detachError
  } = useDetachArticles();
  
  const { 
    data: nonDetachArticles = [], 
    isLoading: nonDetachLoading,
    isError: nonDetachError
  } = useNonDetachArticles();
  
  // Map carousel articles (with isDetach=true)
  const carouselNews = detachArticles?.length > 0 
    ? detachArticles.map(article => mapArticleToNewsItem(article, categories, authors)) 
    : [];
    
  // Map regular articles (with isDetach=false)
  const latestNews = nonDetachArticles?.length > 0 
    ? nonDetachArticles.map(article => mapArticleToNewsItem(article, categories, authors)) 
    : [];
  
  // Efeito para carregamento infinito quando o elemento de referência estiver visível
  useEffect(() => {
    if (inView && initialArticlesLoaded < latestNews.length) {
      setInitialArticlesLoaded(prev => Math.min(prev + 3, latestNews.length));
    }
  }, [inView, latestNews.length, initialArticlesLoaded]);

  return (
    <Layout>
      {/* Stock Ticker */}
      <div className="w-full border-b border-gray-200 overflow-hidden">
        <div className="max-w-screen-2xl mx-auto">
          <StockTicker />
        </div>
      </div>
      
      <div className="max-w-screen-2xl mx-auto px-4 py-6 md:py-8">
        {/* Featured News Carousel - use FeaturedNewsSection for detached articles */}
        <section>
          <FeaturedNewsSection featuredNews={carouselNews} />
        </section>
        
        {/* Latest News - non-detached articles */}
        <section className="mt-8 md:mt-12">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center">
            <span className="mr-2">Últimas Notícias</span>
            <div className="h-1 w-10 bg-finance-500"></div>
          </h2>
          
          {nonDetachLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : nonDetachError ? (
            <div className="w-full py-12 bg-gray-50 rounded-lg text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Não foi possível carregar os artigos</h3>
              <p className="mt-2 text-sm text-gray-500">Tente novamente mais tarde.</p>
            </div>
          ) : latestNews.length === 0 ? (
            <div className="w-full py-12 bg-gray-50 rounded-lg text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Nenhuma notícia disponível</h3>
              <p className="mt-2 text-sm text-gray-500">Novas notícias aparecerão aqui em breve.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {latestNews.slice(0, initialArticlesLoaded).map((news) => (
                  <NewsCard key={news.id} news={news} />
                ))}
              </div>
              
              {/* Elemento de observação para carregamento infinito */}
              {initialArticlesLoaded < latestNews.length && (
                <div 
                  ref={ref} 
                  className="w-full flex justify-center py-8"
                >
                  <div className="animate-pulse flex items-center">
                    <div className="h-2 w-2 bg-gray-400 rounded-full mr-1"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full mr-1"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
        
        {/* Newsletter Signup */}
        <section className="mt-10 md:mt-16 bg-finance-50 p-4 md:p-8 rounded-lg">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl md:text-2xl font-bold mb-2">Fique Informado</h3>
            <p className="text-gray-600 mb-4 md:mb-6">
              Assine nossa newsletter para receber diariamente insights financeiros e atualizações do mercado.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input 
                placeholder="Seu endereço de email" 
                className="flex-grow"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button onClick={handleSubscribe} disabled={isNewsletterLoading}>
                {isNewsletterLoading ? "Processando..." : "Assinar"}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
