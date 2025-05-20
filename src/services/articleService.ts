
import { api } from './api';
import { toast } from "sonner";

// Mock data for fallback when API is unavailable
const MOCK_ARTICLES = [
  {
    id: "mock-1",
    title: "Mercados financeiros em alta após decisão do Banco Central",
    slug: "mercados-financeiros-em-alta",
    content: "<p>Os mercados financeiros globais registraram ganhos significativos após a recente decisão do Banco Central de manter as taxas de juros inalteradas.</p>",
    summary: "Os mercados financeiros globais registraram ganhos significativos após a recente decisão do Banco Central.",
    category: "Mercados",
    author: "Ana Silva",
    status: "published",
    publishDate: new Date().toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f",
    tags: ["Mercados", "Banco Central", "Investimentos"]
  },
  {
    id: "mock-2",
    title: "Nova tecnologia promete revolucionar pagamentos digitais",
    slug: "nova-tecnologia-pagamentos-digitais",
    content: "<p>Uma startup brasileira desenvolveu uma nova tecnologia que promete transformar a maneira como realizamos pagamentos digitais.</p>",
    summary: "Startup brasileira desenvolve solução inovadora para pagamentos digitais.",
    category: "Tecnologia",
    author: "Carlos Mendes",
    status: "published",
    publishDate: new Date().toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3",
    tags: ["Fintech", "Pagamentos", "Tecnologia"]
  },
  {
    id: "mock-3",
    title: "Análise: Os impactos da inflação na economia brasileira",
    slug: "impactos-inflacao-economia-brasileira",
    content: "<p>Especialistas analisam como a recente alta da inflação tem afetado diversos setores da economia brasileira.</p>",
    summary: "Especialistas discutem os efeitos da inflação na economia do país.",
    category: "Economia",
    author: "Paula Rodrigues",
    status: "published",
    publishDate: new Date().toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1611324586758-1ff1534d217b",
    tags: ["Economia", "Inflação", "Brasil"]
  }
];

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
    // Return mock data as fallback
    return MOCK_ARTICLES;
  }
};

export const getArticleById = async (id: string) => {
  try {
    const { data } = await api.get(`/articles/${id}`);
    return data;
  } catch (error) {
    console.error(`Error fetching article with id ${id}:`, error);
    // Try to find a mock article with matching ID
    const mockArticle = MOCK_ARTICLES.find(article => article.id === id);
    if (mockArticle) return mockArticle;
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
    // Try to find a mock article with matching slug
    const mockArticle = MOCK_ARTICLES.find(article => article.slug === slug);
    if (mockArticle) return mockArticle;
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
      return data || MOCK_ARTICLES;
    }
  } catch (error) {
    console.error("Error fetching featured articles:", error);
    return MOCK_ARTICLES;
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
