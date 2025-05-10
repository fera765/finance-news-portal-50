
import { api } from './api';

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
  const { data } = await api.get('/articles', { params });
  return data;
};

export const getArticleById = async (id: string) => {
  const { data } = await api.get(`/articles/${id}`);
  return data;
};

export const getArticleBySlug = async (slug: string) => {
  const { data } = await api.get('/articles', { params: { slug } });
  // JSON Server returns an array, but we need only the first item
  return data[0];
};

export const createArticle = async (article: Article) => {
  const { data } = await api.post('/articles', article);
  return data;
};

export const updateArticle = async (article: Article) => {
  const { data } = await api.put(`/articles/${article.id}`, article);
  return data;
};

export const deleteArticle = async (id: string) => {
  await api.delete(`/articles/${id}`);
  return true;
};

export const getFeaturedArticles = async () => {
  // Get the most viewed articles
  const { data: views } = await api.get('/views', {
    params: {
      _sort: 'count',
      _order: 'desc',
      _limit: 3,
    },
  });

  // Get the full article data for each view entry
  const promises = views.map((view: { articleId: string }) => 
    getArticleById(view.articleId)
  );
  
  const articles = await Promise.all(promises);
  return articles;
};

export const trackArticleView = async (articleId: string) => {
  // Check if there's already a view entry for this article
  const { data: existingViews } = await api.get('/views', {
    params: { articleId },
  });

  if (existingViews.length > 0) {
    // Update existing view count
    const viewEntry = existingViews[0];
    viewEntry.count = viewEntry.count + 1;
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
};
