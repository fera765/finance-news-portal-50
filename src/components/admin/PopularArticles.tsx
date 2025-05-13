
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, LucideIcon } from "lucide-react";
import { format } from "date-fns";

export interface ArticleSummary {
  id: string;
  title: string;
  category: string;
  publishedDate: string;
  views: number;
  likes: number;
  bookmarks?: number;
}

interface PopularArticlesProps {
  title: string;
  description: string;
  articles: ArticleSummary[];
  type: 'views' | 'likes';
  icon?: LucideIcon;
}

const PopularArticles = ({ title, description, articles, type, icon: Icon }: PopularArticlesProps) => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          {Icon && <Icon className="h-5 w-5 text-finance-600" />}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-2">
        <div className="space-y-4">
          {articles.map((article, index) => (
            <div 
              key={article.id}
              className="flex items-center gap-4 border-b border-border pb-4 last:border-0 last:pb-0 px-2"
            >
              <div className="flex-none font-bold text-muted-foreground w-6 text-center">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{article.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {article.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(article.publishedDate), "MMM d")}
                  </span>
                </div>
              </div>
              <div className="flex items-center text-muted-foreground">
                {type === 'views' ? (
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    <span className="text-sm">{article.views}</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-1" />
                    <span className="text-sm">{article.likes}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PopularArticles;
