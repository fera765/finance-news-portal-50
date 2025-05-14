
import { useQuery } from "@tanstack/react-query";
import { 
  getArticles, 
  getArticleById, 
  getArticleBySlug, 
  getFeaturedArticles,
  trackArticleView,
  Article
} from "@/services/articleService";

export function useArticleList() {
  return useQuery({
    queryKey: ['articles'],
    queryFn: getArticles
  });
}

export function useArticleById(id: string | undefined) {
  return useQuery({
    queryKey: ['article', id],
    queryFn: () => id ? getArticleById(id) : null,
    enabled: !!id
  });
}

export function useArticleBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['article', 'slug', slug],
    queryFn: () => slug ? getArticleBySlug(slug) : null,
    enabled: !!slug
  });
}

export function useFeaturedArticles() {
  return useQuery({
    queryKey: ['articles', 'featured'],
    queryFn: getFeaturedArticles
  });
}
