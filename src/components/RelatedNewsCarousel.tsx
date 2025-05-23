
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { getArticles } from "@/services/articleService";
import { getCategories } from "@/services/categoryService";
import { getUsers } from "@/services/userService";
import { Article } from "@/services/articleService";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

interface RelatedNewsCarouselProps {
  articleId: string;
  categoryId?: string;
  tags?: string[];
}

const RelatedNewsCarousel = ({ articleId, categoryId, tags }: RelatedNewsCarouselProps) => {
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);

  // Buscar artigos relacionados pela categoria
  const { data: articles = [] } = useQuery({
    queryKey: ["articles", "related", categoryId],
    queryFn: () => getArticles({ 
      category: categoryId, 
      _limit: 6,
      _sort: "publishDate",
      _order: "desc"
    }),
    enabled: !!categoryId
  });

  // Buscar categorias para obter o nome
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories
  });

  // Buscar autores para obter nomes
  const { data: authors = [] } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers
  });

  // Filtrar e preparar artigos relacionados
  useEffect(() => {
    if (articles && articles.length > 0) {
      // Filtrar o artigo atual e limitar a 3
      const filtered = articles
        .filter(article => article.id !== articleId)
        .slice(0, 3);
      
      setRelatedArticles(filtered);
    }
  }, [articles, articleId]);

  // Formatar data de publicação
  const formatPublishDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d MMM, yyyy", { locale: ptBR });
    } catch {
      return "Data indisponível";
    }
  };

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 md:mb-10">
      <h3 className="text-xl font-bold mb-4">Artigos Relacionados</h3>
      <Carousel className="relative">
        <CarouselContent>
          {relatedArticles.map((article) => {
            const categoryName = categories.find(cat => cat.id === article.category)?.name || "Sem categoria";
            const authorName = authors.find(auth => auth.id === article.author)?.name || "Autor desconhecido";
            const categorySlug = categories.find(cat => cat.id === article.category)?.slug || '';
            
            return (
              <CarouselItem key={article.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow h-full">
                  <Link to={`/news/${article.id}/${article.slug}`} className="flex flex-col h-full">
                    <div className="w-full h-40">
                      <img 
                        src={article.imageUrl || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'} 
                        alt={article.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d';
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 flex flex-col flex-grow">
                      <Link to={`/category/${categorySlug}`} className="mb-2">
                        <Badge className="bg-finance-100 text-finance-800 hover:bg-finance-200">{categoryName}</Badge>
                      </Link>
                      <h4 className="font-semibold text-sm line-clamp-2 mb-2">{article.title}</h4>
                      <p className="text-gray-500 text-xs mt-auto">
                        {article.publishDate && formatPublishDate(article.publishDate.toString())}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Por {authorName}
                      </p>
                    </div>
                  </Link>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2" />
      </Carousel>
    </div>
  );
};

export default RelatedNewsCarousel;
