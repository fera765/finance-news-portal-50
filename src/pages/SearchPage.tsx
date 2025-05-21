
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getArticles } from "@/services/articleService";
import NewsCard, { NewsItem } from "@/components/NewsCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, Search } from "lucide-react";
import { getCategories } from "@/services/categoryService";
import { getUsers } from "@/services/userService";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [visibleResults, setVisibleResults] = useState(9);
  
  // Fetch articles, categories and users
  const { data: articles = [], isLoading: articlesLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: () => getArticles(),
  });
  
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  });
  
  const { data: authors = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers(),
  });
  
  // Update query state when URL param changes
  useEffect(() => {
    const queryParam = searchParams.get("q");
    if (queryParam) {
      setQuery(queryParam);
    }
  }, [searchParams]);
  
  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(query ? { q: query } : {});
    setVisibleResults(9); // Reset pagination when searching
  };
  
  // Filter articles based on search query
  const filteredArticles = articles.filter((article: any) => {
    if (!query) return false;
    
    const searchTerms = query.toLowerCase().split(" ");
    const articleText = `${article.title} ${article.content} ${article.summary}`.toLowerCase();
    
    return searchTerms.every(term => articleText.includes(term));
  });
  
  // Convert API article to NewsItem format
  const mapArticleToNewsItem = (article: any): NewsItem => {
    // Encontrar nome da categoria baseado no ID
    const categoryName = categories.find(cat => cat.id === article.category)?.name || 'Geral';
    
    // Encontrar nome do autor baseado no ID
    const authorName = authors.find(auth => auth.id === article.author)?.name || 'Equipe Editorial';
    
    return {
      id: article.id || crypto.randomUUID(),
      title: article.title || "Sem título",
      summary: article.summary || 'Sem resumo disponível',
      imageUrl: article.imageUrl || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
      category: categoryName,
      publishedDate: typeof article.publishDate === 'object' && article.publishDate instanceof Date 
        ? article.publishDate.toISOString() 
        : String(article.publishDate) || new Date().toISOString(),
      author: authorName,
      slug: article.slug || `artigo-${article.id || crypto.randomUUID()}`
    };
  };
  
  const searchResults = filteredArticles.map(mapArticleToNewsItem);
  
  // Load more results
  const loadMore = () => {
    setVisibleResults(prev => prev + 6);
  };

  return (
    <Layout>
      <div className="max-w-screen-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Pesquisar</h1>
        
        {/* Search form */}
        <form onSubmit={handleSearch} className="mb-8 flex gap-2 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Digite sua pesquisa..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit">Buscar</Button>
        </form>
        
        {/* Search results */}
        {searchParams.get("q") && (
          <>
            <h2 className="text-xl font-semibold mb-4">
              {searchResults.length > 0 
                ? `${searchResults.length} resultados encontrados para "${searchParams.get("q")}"`
                : `Nenhum resultado encontrado para "${searchParams.get("q")}"`}
            </h2>
            
            {articlesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : searchResults.length === 0 ? (
              <div className="w-full py-12 bg-gray-50 rounded-lg text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Nenhuma notícia encontrada</h3>
                <p className="mt-2 text-sm text-gray-500">Tente uma nova pesquisa com termos diferentes.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.slice(0, visibleResults).map((news) => (
                    <NewsCard key={news.id} news={news} />
                  ))}
                </div>
                
                {visibleResults < searchResults.length && (
                  <div className="mt-8 text-center">
                    <Button onClick={loadMore} variant="outline">
                      Carregar mais resultados
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
