
import { useState } from "react";
import Layout from "@/components/Layout";
import NewsCard, { NewsItem } from "@/components/NewsCard";
import FeaturedNewsSection from "@/components/FeaturedNewsSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StockTicker from "@/components/StockTicker";
import { useFeaturedArticles, useArticleList } from "@/hooks/useNews";
import { Article } from "@/services/articleService";

// Convert API article to NewsItem format
const mapArticleToNewsItem = (article: Article): NewsItem => ({
  id: article.id || '',
  title: article.title,
  summary: article.summary || '',
  imageUrl: article.imageUrl || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
  category: article.category,
  publishedDate: typeof article.publishDate === 'object' && article.publishDate instanceof Date 
    ? article.publishDate.toISOString() 
    : String(article.publishDate) || new Date().toISOString(),
  author: article.author,
  slug: article.slug
});

const Index = () => {
  const [visibleNews, setVisibleNews] = useState(6);
  
  // Use React Query hooks to fetch data
  const { data: featuredArticles = [], isLoading: featuredLoading } = useFeaturedArticles();
  const { data: allArticles = [], isLoading: articlesLoading } = useArticleList();
  
  // Map API data to component format
  const featuredNews = featuredArticles.map(mapArticleToNewsItem);
  const latestNews = allArticles.map(mapArticleToNewsItem);
  
  const loadMore = () => {
    setVisibleNews(prev => prev + 3);
  };

  return (
    <Layout>
      {/* Stock Ticker */}
      <div className="w-full border-b border-gray-200 overflow-hidden">
        <div className="max-w-screen-2xl mx-auto">
          <StockTicker />
        </div>
      </div>
      
      <div className="max-w-screen-2xl mx-auto px-4 py-6 md:py-8">
        {/* Featured News Carousel */}
        {featuredLoading ? (
          <div className="w-full h-72 bg-gray-100 animate-pulse rounded-lg"></div>
        ) : (
          <FeaturedNewsSection featuredNews={featuredNews.length > 0 ? featuredNews : []} />
        )}
        
        {/* Latest News */}
        <section className="mt-8 md:mt-12">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center">
            <span className="mr-2">Latest News</span>
            <div className="h-1 w-10 bg-finance-500"></div>
          </h2>
          
          {articlesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {latestNews.slice(0, visibleNews).map((news) => (
                  <NewsCard key={news.id} news={news} />
                ))}
              </div>
              
              {visibleNews < latestNews.length && (
                <div className="mt-6 md:mt-8 text-center">
                  <Button onClick={loadMore} variant="outline">
                    Load More Articles
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
        
        {/* Newsletter Signup */}
        <section className="mt-10 md:mt-16 bg-finance-50 p-4 md:p-8 rounded-lg">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl md:text-2xl font-bold mb-2">Stay Informed</h3>
            <p className="text-gray-600 mb-4 md:mb-6">
              Subscribe to our newsletter for daily financial insights and market updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input 
                placeholder="Your email address" 
                className="flex-grow"
                type="email"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
