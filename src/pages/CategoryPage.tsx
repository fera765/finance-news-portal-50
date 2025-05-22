
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import NewsCard from "@/components/NewsCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import StockTicker from "@/components/StockTicker";
import { useQuery } from "@tanstack/react-query";
import { getArticles } from "@/services/articleService";
import { getCategories } from "@/services/categoryService";
import { getUsers } from "@/services/userService";
import { Article } from "@/services/articleService";
import { useInView } from "react-intersection-observer";

const ARTICLES_PER_PAGE = 6;

const mapArticleToNewsItem = (article: Article, categoryName: string, authorName: string) => {
  return {
    id: article.id || "",
    title: article.title,
    summary: article.summary || "",
    imageUrl: article.imageUrl || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    category: categoryName,
    publishedDate: typeof article.publishDate === "string" ? article.publishDate : new Date().toISOString(),
    author: authorName,
    slug: article.slug
  };
};

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Fetch categories to get the current category info
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories
  });

  const currentCategory = categories.find(cat => cat.slug === slug);

  // Get users for author names
  const { data: authors = [] } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers
  });

  // Fetch articles for this category with pagination
  const { data: articles = [], isLoading, isError, fetchStatus } = useQuery({
    queryKey: ["articles", "category", currentCategory?.id, page],
    queryFn: () => getArticles({ 
      category: currentCategory?.id, 
      _page: page, 
      _limit: ARTICLES_PER_PAGE,
      _sort: "publishDate",
      _order: "desc"
    }),
    enabled: !!currentCategory?.id,
    placeholderData: previousData => previousData // This replaces keepPreviousData
  });
  
  // Append new articles to our collection when they arrive
  useEffect(() => {
    if (articles && articles.length > 0) {
      // Check for duplicates before adding
      const newArticles = articles.filter(
        newArticle => !allArticles.some(existingArticle => 
          existingArticle.id === newArticle.id
        )
      );
      
      if (newArticles.length > 0) {
        setAllArticles(prev => [...prev, ...newArticles]);
      }
      
      // If we got fewer articles than requested, there are no more to load
      if (articles.length < ARTICLES_PER_PAGE) {
        setHasMore(false);
      }
    } else if (articles && articles.length === 0 && page > 1) {
      setHasMore(false);
    }
  }, [articles, page]);

  // Load more when the sentinel comes into view
  useEffect(() => {
    if (inView && hasMore && !isLoading && fetchStatus !== 'fetching') {
      setPage(prevPage => prevPage + 1);
    }
  }, [inView, hasMore, isLoading, fetchStatus]);

  // Map articles to news items with proper names
  const newsItems = allArticles.map(article => {
    const categoryName = categories.find(cat => cat.id === article.category)?.name || "Sem categoria";
    const authorName = authors.find(auth => auth.id === article.author)?.name || "Autor desconhecido";
    return mapArticleToNewsItem(article, categoryName, authorName);
  });

  if (isLoading && page === 1) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 border-4 border-t-blue-500 border-b-blue-300 rounded-full animate-spin"></div>
            <p className="text-gray-600">Carregando artigos...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (isError || !currentCategory) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Categoria não encontrada</h1>
          <p className="mb-6">Desculpe, a categoria que você procura não existe ou foi removida.</p>
          <Button onClick={() => navigate("/")}>Voltar para a Página Inicial</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Stock Ticker */}
      <div className="w-full border-b border-gray-200 mb-4">
        <div className="container mx-auto">
          <StockTicker />
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6 md:py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-4 md:mb-6 flex items-center text-gray-600 hover:text-finance-700"
        >
          <ChevronLeft size={20} className="mr-1" />
          Voltar
        </Button>
        
        <h1 className="text-3xl font-bold mb-2">{currentCategory.name}</h1>
        {currentCategory.description && (
          <p className="text-gray-600 mb-8 md:mb-10">{currentCategory.description}</p>
        )}
        
        {newsItems.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-medium mb-2">Nenhum artigo disponível</h3>
            <p className="text-gray-500">Esta categoria ainda não possui artigos publicados.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsItems.map((item) => (
                <NewsCard key={item.id} news={item} />
              ))}
            </div>
            
            {hasMore && (
              <div ref={ref} className="mt-8 flex justify-center">
                <div className="h-8 w-8 border-4 border-t-blue-500 border-b-blue-300 rounded-full animate-spin"></div>
              </div>
            )}
            
            {!hasMore && newsItems.length > 0 && (
              <p className="text-center text-gray-500 mt-8">
                Todos os artigos desta categoria foram carregados.
              </p>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default CategoryPage;
