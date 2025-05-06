
import { useState } from "react";
import { Button } from "@/components/ui/button";
import NewsCard, { NewsItem } from "./NewsCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FeaturedNewsSectionProps {
  featuredNews: NewsItem[];
}

const FeaturedNewsSection = ({ featuredNews }: FeaturedNewsSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? featuredNews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === featuredNews.length - 1 ? 0 : prev + 1));
  };

  if (!featuredNews.length) {
    return null;
  }

  return (
    <div className="relative">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <span className="mr-2">Featured</span>
        <div className="h-1 w-10 bg-gold-500"></div>
      </h2>
      
      <div className="overflow-hidden relative">
        <div 
          className="transition-all duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          <div className="flex">
            {featuredNews.map((news) => (
              <div 
                key={news.id}
                className="w-full flex-none"
              >
                <NewsCard news={news} featured />
              </div>
            ))}
          </div>
        </div>
        
        {featuredNews.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow"
              onClick={handlePrev}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow"
              onClick={handleNext}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {featuredNews.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-finance-600" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FeaturedNewsSection;
