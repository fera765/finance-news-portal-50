
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  publishDate?: string;
  views?: number;
  likes?: number;
  comments?: number;
  bookmarks?: number;
}

interface PopularArticlesProps {
  title: string;
  description: string;
  articles: Article[];
  type: "views" | "likes" | "bookmarks";
  icon: LucideIcon;
}

const PopularArticles = ({
  title,
  description,
  articles,
  type,
  icon: Icon
}: PopularArticlesProps) => {
  const [isHovering, setIsHovering] = useState<string | null>(null);

  // Function to safely format date or return a fallback
  const safeFormatDate = (dateString?: string) => {
    if (!dateString) return "Data não disponível";
    
    try {
      const date = new Date(dateString);
      // Check if date is valid before formatting
      if (isNaN(date.getTime())) {
        return "Data inválida";
      }
      return format(date, "d 'de' MMMM, yyyy", { locale: ptBR });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Erro na data";
    }
  };

  // Function to get the value based on the type
  const getValue = (article: Article) => {
    switch (type) {
      case "views":
        return article.views || 0;
      case "likes":
        return article.likes || 0;
      case "bookmarks":
        return article.bookmarks || 0;
      default:
        return 0;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
        <p className="text-sm text-gray-500">{description}</p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {articles.length === 0 ? (
            <div className="px-6 py-4 text-center text-gray-500">
              Nenhum artigo encontrado
            </div>
          ) : (
            articles.map((article) => (
              <div 
                key={article.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
                onMouseEnter={() => setIsHovering(article.id)}
                onMouseLeave={() => setIsHovering(null)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 line-clamp-2">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 rounded-full">
                        {article.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {safeFormatDate(article.publishDate)}
                      </span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                    isHovering === article.id ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon className="h-4 w-4" />
                    <span className="text-xs font-medium">{getValue(article)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PopularArticles;
