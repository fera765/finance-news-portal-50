
import { api } from './api';
import { toast } from "sonner";

export interface Article {
  id?: string;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  category: string;
  author: string;
  status: 'draft' | 'published' | 'scheduled';
  publishDate?: Date | string;
  imageUrl?: string;
  tags?: string[];
}

export const getArticles = async (params = {}) => {
  try {
    const { data } = await api.get('/articles', { params });
    return data || [];
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
};

export const getArticleById = async (id: string) => {
  try {
    const { data } = await api.get(`/articles/${id}`);
    return data;
  } catch (error) {
    console.error(`Error fetching article with id ${id}:`, error);
    throw error;
  }
};

export const getArticleBySlug = async (slug: string) => {
  try {
    const { data } = await api.get('/articles', { params: { slug } });
    // JSON Server returns an array, but we need only the first item
    if (Array.isArray(data) && data.length > 0) {
      return data[0];
    }
    throw new Error(`Article with slug ${slug} not found`);
  } catch (error) {
    console.error(`Error fetching article with slug ${slug}:`, error);
    throw error;
  }
};

export const createArticle = async (article: Article) => {
  try {
    const { data } = await api.post('/articles', article);
    toast.success("Artigo criado com sucesso");
    return data;
  } catch (error) {
    console.error("Error creating article:", error);
    toast.error("Falha ao criar artigo");
    throw error;
  }
};

export const updateArticle = async (article: Article) => {
  try {
    const { data } = await api.put(`/articles/${article.id}`, article);
    toast.success("Artigo atualizado com sucesso");
    return data;
  } catch (error) {
    console.error(`Error updating article with id ${article.id}:`, error);
    toast.error("Falha ao atualizar artigo");
    throw error;
  }
};

export const deleteArticle = async (id: string) => {
  try {
    await api.delete(`/articles/${id}`);
    toast.success("Artigo excluído com sucesso");
    return true;
  } catch (error) {
    console.error(`Error deleting article with id ${id}:`, error);
    toast.error("Falha ao excluir artigo");
    throw error;
  }
};

export const getFeaturedArticles = async () => {
  try {
    // Try to get the most viewed articles
    const { data: views } = await api.get('/views', {
      params: {
        _sort: 'count',
        _order: 'desc',
        _limit: 3,
      },
    });

    if (Array.isArray(views) && views.length > 0) {
      // Get the full article data for each view entry
      const promises = views.map((view: { articleId: string }) => 
        getArticleById(view.articleId).catch(() => null)
      );
      
      const articles = await Promise.all(promises);
      // Filter out any nulls from failed requests
      return articles.filter(article => article !== null);
    } else {
      // Fallback to regular articles if no views are tracked
      const { data } = await api.get('/articles', {
        params: {
          _sort: 'publishDate',
          _order: 'desc',
          _limit: 3,
          status: 'published'
        }
      });
      return data || [];
    }
  } catch (error) {
    console.error("Error fetching featured articles:", error);
    return [];
  }
};

export const trackArticleView = async (articleId: string) => {
  try {
    // Check if there's already a view entry for this article
    const { data: existingViews } = await api.get('/views', {
      params: { articleId },
    });

    if (Array.isArray(existingViews) && existingViews.length > 0) {
      // Update existing view count
      const viewEntry = existingViews[0];
      viewEntry.count = (viewEntry.count || 0) + 1;
      await api.put(`/views/${viewEntry.id}`, viewEntry);
      return viewEntry;
    } else {
      // Create new view entry
      const { data } = await api.post('/views', {
        articleId,
        count: 1,
      });
      return data;
    }
  } catch (error) {
    console.error(`Error tracking view for article ${articleId}:`, error);
    // Don't throw as this is a non-critical operation
    return null;
  }
};
