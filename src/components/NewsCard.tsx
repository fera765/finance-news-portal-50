
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { FileText } from "lucide-react";

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  category: string;
  publishedDate: string;
  author: string;
  isFeatured?: boolean;
  slug: string;
}

interface NewsCardProps {
  news: NewsItem;
  featured?: boolean;
}

const NewsCard = ({ news, featured = false }: NewsCardProps) => {
  // Handle potential invalid dates
  const getPublishedAgo = () => {
    try {
      return formatDistanceToNow(new Date(news.publishedDate), { addSuffix: true });
    } catch (e) {
      return "Recentemente";
    }
  };
  
  const publishedAgo = getPublishedAgo();
  const articleUrl = `/news/${news.id}/${news.slug}`;
  
  // Fallback image handling
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d';
    e.currentTarget.onerror = null; // Prevent infinite loop
  };

  if (featured) {
    return (
      <Card className="overflow-hidden border-0 shadow-md hover-grow">
        <div className="grid md:grid-cols-2 h-full">
          <div className="relative h-64 md:h-full">
            <img 
              src={news.imageUrl} 
              alt={news.title} 
              onError={handleImageError}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <CardContent className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="bg-gold-100 text-finance-800 hover:bg-gold-200">
                  {news.category}
                </Badge>
                <span className="text-xs text-gray-500">{publishedAgo}</span>
              </div>
              <Link to={articleUrl}>
                <h2 className="text-2xl font-bold mb-2 hover:text-finance-700">{news.title}</h2>
              </Link>
              <p className="text-gray-600 line-clamp-3">{news.summary}</p>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Por {news.author}
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-0 shadow hover-grow">
      <div className="relative h-48">
        <img 
          src={news.imageUrl} 
          alt={news.title}
          onError={handleImageError} 
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="bg-finance-50 text-finance-800 hover:bg-finance-100">
            {news.category}
          </Badge>
          <span className="text-xs text-gray-500">{publishedAgo}</span>
        </div>
        <Link to={articleUrl}>
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 hover:text-finance-700">
            {news.title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm line-clamp-2 mb-2">{news.summary}</p>
        <div className="text-xs text-gray-500">
          Por {news.author}
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
