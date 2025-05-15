
import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { NewsItem } from "@/components/NewsCard";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

interface UseUserArticlesReturn {
  savedArticles: NewsItem[];
  likedArticles: NewsItem[];
  isLoading: boolean;
  error: Error | null;
}

export const useUserArticles = (): UseUserArticlesReturn => {
  const [savedArticles, setSavedArticles] = useState<NewsItem[]>([]);
  const [likedArticles, setLikedArticles] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserInteractions = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Buscar artigos salvos pelo usuário
        const bookmarksResponse = await api.get(`/bookmarks?userId=${user.id}`);
        const bookmarks = bookmarksResponse.data;

        // Buscar artigos curtidos pelo usuário
        const likesResponse = await api.get(`/likes?userId=${user.id}`);
        const likes = likesResponse.data;

        // Buscar detalhes dos artigos salvos
        const savedArticlesPromises = bookmarks.map(async (bookmark: any) => {
          const { data } = await api.get(`/articles/${bookmark.articleId}`);
          return {
            ...data,
            id: data.id,
            title: data.title,
            summary: data.summary || data.content.substring(0, 120) + "...",
            imageUrl: data.imageUrl || "https://via.placeholder.com/300x200",
            publishedDate: data.publishDate || new Date().toISOString(),
            author: data.author || "Unknown Author",
            category: data.category || "Uncategorized"
          };
        });

        // Buscar detalhes dos artigos curtidos
        const likedArticlesPromises = likes.map(async (like: any) => {
          const { data } = await api.get(`/articles/${like.articleId}`);
          return {
            ...data,
            id: data.id,
            title: data.title,
            summary: data.summary || data.content.substring(0, 120) + "...",
            imageUrl: data.imageUrl || "https://via.placeholder.com/300x200",
            publishedDate: data.publishDate || new Date().toISOString(),
            author: data.author || "Unknown Author",
            category: data.category || "Uncategorized"
          };
        });

        // Resolver todas as promessas
        const resolvedSavedArticles = await Promise.all(savedArticlesPromises);
        const resolvedLikedArticles = await Promise.all(likedArticlesPromises);

        setSavedArticles(resolvedSavedArticles);
        setLikedArticles(resolvedLikedArticles);
      } catch (err: any) {
        console.error("Error fetching user interactions:", err);
        setError(err);
        toast.error("Erro ao carregar interações do usuário");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInteractions();
  }, [user?.id]);

  return { savedArticles, likedArticles, isLoading, error };
};
