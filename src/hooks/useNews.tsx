
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

export function useArticleList(params = {}) {
  return useQuery({
    queryKey: ['articles', params],
    queryFn: () => getArticles(params),
    staleTime: 300000, // 5 minutes
    retry: 3,
    meta: {
      onError: (error: any) => {
        console.error("Error loading articles:", error);
        toast.error("Não foi possível carregar os artigos.");
      }
    }
  });
}

export function useArticleById(id: string | undefined) {
  return useQuery({
    queryKey: ['article', id],
    queryFn: () => id ? getArticleById(id) : null,
    enabled: !!id,
    retry: 3,
    meta: {
      onSuccess: (data: Article | null) => {
        if (data?.id) {
          // Track view silently in background
          trackArticleView(data.id).catch(console.error);
        }
      },
      onError: (error: any) => {
        console.error(`Error loading article (ID: ${id}):`, error);
        toast.error("Não foi possível carregar o artigo.");
      }
    }
  });
}

export function useArticleBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['article', 'slug', slug],
    queryFn: () => slug ? getArticleBySlug(slug) : null,
    enabled: !!slug,
    retry: 3,
    meta: {
      onSuccess: (data: Article | null) => {
        if (data?.id) {
          // Track view silently in background
          trackArticleView(data.id).catch(console.error);
        }
      },
      onError: (error: any) => {
        console.error(`Error loading article (slug: ${slug}):`, error);
        toast.error("Não foi possível carregar o artigo.");
      }
    }
  });
}

export function useFeaturedArticles() {
  return useQuery({
    queryKey: ['articles', 'featured'],
    queryFn: getFeaturedArticles,
    staleTime: 300000, // 5 minutes
    retry: 3,
    meta: {
      onError: (error: any) => {
        console.error("Error fetching featured articles:", error);
        toast.error("Não foi possível carregar os artigos em destaque.");
      }
    }
  });
}

export function useDetachArticles() {
  return useQuery({
    queryKey: ['articles', 'isDetach'],
    queryFn: () => getArticles({ 
      isDetach: true,
      status: 'published',
      _sort: 'publishDate',
      _order: 'desc'
    }),
    staleTime: 300000, // 5 minutes
    retry: 3,
    meta: {
      onError: (error: any) => {
        console.error("Error fetching carousel articles:", error);
        toast.error("Não foi possível carregar os artigos do carrossel.");
      }
    }
  });
}

export function useNonDetachArticles() {
  return useQuery({
    queryKey: ['articles', 'nonDetach'],
    queryFn: () => getArticles({ 
      isDetach: false,
      status: 'published',
      _sort: 'publishDate',
      _order: 'desc'
    }),
    staleTime: 300000, // 5 minutes
    retry: 3,
    meta: {
      onError: (error: any) => {
        console.error("Error fetching non-carousel articles:", error);
        toast.error("Não foi possível carregar os artigos.");
      }
    }
  });
}
