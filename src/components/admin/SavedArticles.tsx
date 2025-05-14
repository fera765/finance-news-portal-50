
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

export interface BookmarkedArticle {
  id: string;
  title: string;
  category: string;
  publishedDate: string;
  bookmarks?: number;
  views?: number;
  likes?: number;
}

interface SavedArticlesProps {
  title: string;
  description: string;
  articles: BookmarkedArticle[];
  icon?: LucideIcon;
}

const SavedArticles: React.FC<SavedArticlesProps> = ({
  title,
  description,
  articles,
  icon: Icon,
}) => {
  const formatDate = (dateString: string) => {
    try {
      // Check if dateString is valid
      if (!dateString) return "Invalid date";
      
      // Try to parse the date - this will handle both ISO strings and other date formats
      const date = new Date(dateString);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      
      return new Intl.DateTimeFormat("pt-BR", {
        day: "numeric",
        month: "short",
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error, "Date string was:", dateString);
      return "Invalid date";
    }
  };

  return (
    <Card className="shadow-sm h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {Icon && <Icon className="h-5 w-5 text-finance-600" />}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {articles.map((article) => (
            <div key={article.id} className="flex items-start gap-3">
              <div className="mt-0.5 min-w-[40px] text-center">
                <div className="font-semibold text-finance-700">
                  {article.bookmarks}
                </div>
                <div className="text-xs text-gray-500">salvos</div>
              </div>
              <div>
                <h3 className="font-medium text-sm line-clamp-2">
                  {article.title}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <span className="bg-gray-100 px-1.5 py-0.5 rounded">
                    {article.category}
                  </span>
                  <span>{formatDate(article.publishedDate)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SavedArticles;
