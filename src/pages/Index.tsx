
import { useState } from "react";
import Layout from "@/components/Layout";
import NewsCard, { NewsItem } from "@/components/NewsCard";
import FeaturedNewsSection from "@/components/FeaturedNewsSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StockTicker from "@/components/StockTicker";

// Mock data
const mockFeaturedNews: NewsItem[] = [
  {
    id: "1",
    title: "Federal Reserve Signals Possible Interest Rate Cuts in Coming Months",
    summary: "Central bank officials indicate a shift in monetary policy as inflation eases and economic growth stabilizes. Markets respond positively to the news with stocks rallying.",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=80",
    category: "Economy",
    publishedDate: "2025-05-05T14:30:00Z",
    author: "Michael Stevens",
    slug: "federal-reserve-signals-possible-interest-rate-cuts"
  },
  {
    id: "2",
    title: "Global Markets Rally as Trade Tensions Ease Between Major Economies",
    summary: "Asian and European markets see significant gains following announcement of new trade agreements. Technology and manufacturing sectors lead the surge.",
    imageUrl: "https://images.unsplash.com/photo-1460472178825-e5240623afd5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=80",
    category: "Markets",
    publishedDate: "2025-05-04T10:15:00Z",
    author: "Sarah Johnson",
    slug: "global-markets-rally-trade-tensions-ease"
  },
  {
    id: "3",
    title: "Tech Giant Unveils Revolutionary AI-Powered Financial Analysis Platform",
    summary: "New platform promises to transform investment strategies with advanced predictive analytics and real-time market insights. Early adopters report significant performance improvements.",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=80",
    category: "Technology",
    publishedDate: "2025-05-03T16:45:00Z",
    author: "David Wong",
    slug: "tech-giant-unveils-revolutionary-ai-powered-financial-analysis"
  }
];

const mockLatestNews: NewsItem[] = [
  {
    id: "4",
    title: "Cryptocurrency Market Faces Regulatory Challenges in Major Economies",
    summary: "New regulatory frameworks being introduced across Europe and Asia create uncertainty for crypto investors and exchanges.",
    imageUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
    category: "Cryptocurrency",
    publishedDate: "2025-05-05T09:20:00Z",
    author: "Jessica Lee",
    slug: "cryptocurrency-market-faces-regulatory-challenges"
  },
  {
    id: "5",
    title: "Oil Prices Stabilize Following Middle East Production Agreement",
    summary: "Major oil-producing nations reach consensus on output levels, bringing stability to global energy markets after weeks of volatility.",
    imageUrl: "https://images.unsplash.com/photo-1582486225644-dab37c8b1d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
    category: "Commodities",
    publishedDate: "2025-05-04T18:00:00Z",
    author: "Robert Martinez",
    slug: "oil-prices-stabilize-middle-east-production-agreement"
  },
  {
    id: "6",
    title: "Banking Sector Shows Resilience Amid Economic Uncertainty",
    summary: "Q1 earnings reports from major financial institutions exceed expectations despite challenges in the broader economy.",
    imageUrl: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
    category: "Banking",
    publishedDate: "2025-05-04T11:30:00Z",
    author: "Thomas Wilson",
    slug: "banking-sector-shows-resilience-amid-economic-uncertainty"
  },
  {
    id: "7",
    title: "Sustainable Investing Reaches Record Levels as Climate Concerns Grow",
    summary: "ESG funds see unprecedented inflows as investors increasingly prioritize environmental and social governance factors in their portfolios.",
    imageUrl: "https://images.unsplash.com/photo-1470790376778-a9f1903c3a4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
    category: "Investing",
    publishedDate: "2025-05-03T14:15:00Z",
    author: "Emma Green",
    slug: "sustainable-investing-reaches-record-levels"
  },
  {
    id: "8",
    title: "Housing Market Cools as Mortgage Rates Continue to Rise",
    summary: "Home sales decline for the third consecutive month as higher borrowing costs impact buyer demand across major metropolitan areas.",
    imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
    category: "Real Estate",
    publishedDate: "2025-05-02T16:00:00Z",
    author: "Daniel Brown",
    slug: "housing-market-cools-mortgage-rates-continue-rise"
  },
  {
    id: "9",
    title: "Major Retailer Announces Expansion Plans Following Strong Q1 Performance",
    summary: "Company plans to open 50 new locations and enhance e-commerce capabilities after exceeding revenue and profit forecasts.",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
    category: "Business",
    publishedDate: "2025-05-02T10:45:00Z",
    author: "Patricia Anderson",
    slug: "major-retailer-announces-expansion-plans"
  }
];

const Index = () => {
  const [visibleNews, setVisibleNews] = useState(6);
  
  const loadMore = () => {
    setVisibleNews(prev => prev + 3);
  };

  return (
    <Layout>
      {/* Stock Ticker */}
      <div className="w-full border-b border-gray-200">
        <div className="container mx-auto">
          <StockTicker />
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Featured News Carousel */}
        <FeaturedNewsSection featuredNews={mockFeaturedNews} />
        
        {/* Latest News */}
        <section className="mt-8 md:mt-12">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center">
            <span className="mr-2">Latest News</span>
            <div className="h-1 w-10 bg-finance-500"></div>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {mockLatestNews.slice(0, visibleNews).map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
          
          {visibleNews < mockLatestNews.length && (
            <div className="mt-6 md:mt-8 text-center">
              <Button onClick={loadMore} variant="outline">
                Load More Articles
              </Button>
            </div>
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
