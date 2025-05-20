
import { useQuery } from "@tanstack/react-query";
import { 
  getArticles, 
  getArticleById, 
  getArticleBySlug, 
  getFeaturedArticles,
  trackArticleView,
  Article
} from "@/services/articleService";
import { toast } from "sonner";

export function useArticleList() {
  return useQuery({
    queryKey: ['articles'],
    queryFn: () => getArticles(),
    staleTime: 300000, // 5 minutes
    onError: (error) => {
      console.error("Error loading articles:", error);
      toast.error("Não foi possível carregar os artigos.");
    }
  });
}

export function useArticleById(id: string | undefined) {
  return useQuery({
    queryKey: ['article', id],
    queryFn: () => id ? getArticleById(id) : null,
    enabled: !!id,
    onSuccess: (data) => {
      if (data?.id) {
        // Track view silently in background
        trackArticleView(data.id).catch(console.error);
      }
    },
    onError: (error) => {
      console.error(`Error loading article (ID: ${id}):`, error);
      toast.error("Não foi possível carregar o artigo.");
    }
  });
}

export function useArticleBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['article', 'slug', slug],
    queryFn: () => slug ? getArticleBySlug(slug) : null,
    enabled: !!slug,
    onSuccess: (data) => {
      if (data?.id) {
        // Track view silently in background
        trackArticleView(data.id).catch(console.error);
      }
    },
    onError: (error) => {
      console.error(`Error loading article (slug: ${slug}):`, error);
      toast.error("Não foi possível carregar o artigo.");
    }
  });
}

export function useFeaturedArticles() {
  return useQuery({
    queryKey: ['articles', 'featured'],
    queryFn: getFeaturedArticles,
    staleTime: 300000, // 5 minutes
    onError: (error) => {
      console.error("Error loading featured articles:", error);
      toast.error("Não foi possível carregar os artigos em destaque.");
    },
    // Fallback to empty array to avoid errors
    placeholderData: []
  });
}
