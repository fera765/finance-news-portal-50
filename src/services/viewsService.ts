
import { api } from './api';

export interface ArticleView {
  id?: string;
  articleId: string;
  count: number;
  lastUpdated: string;
}

export interface SiteView {
  id?: string;
  date: string;
  count: number;
  lastUpdated: string;
}

// Rastrear visualização de artigo
export const trackArticleView = async (articleId: string) => {
  try {
    // Verificar se já existe uma entrada de visualização para este artigo
    const { data: existingViews } = await api.get('/views', {
      params: { articleId },
    });

    const now = new Date().toISOString();

    if (Array.isArray(existingViews) && existingViews.length > 0) {
      // Atualizar contagem de visualização existente
      const viewEntry = existingViews[0];
      const updatedCount = (viewEntry.count || 0) + 1;
      
      await api.patch(`/views/${viewEntry.id}`, {
        ...viewEntry,
        count: updatedCount,
        lastUpdated: now
      });
      
      return {
        ...viewEntry,
        count: updatedCount,
        lastUpdated: now
      };
    } else {
      // Criar nova entrada de visualização
      const newViewEntry = {
        articleId,
        count: 1,
        lastUpdated: now
      };
      
      const { data } = await api.post('/views', newViewEntry);
      return data;
    }
  } catch (error) {
    console.error(`Erro ao rastrear visualização para artigo ${articleId}:`, error);
    // Não lançar pois esta é uma operação não crítica
    return null;
  }
};

// Rastrear visualização do site
export const trackSiteView = async () => {
  try {
    // Obter a data de hoje no formato YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    
    // Verificar se já existe uma entrada de visualização para hoje
    const { data: existingViews } = await api.get('/site-views', {
      params: { date: today },
    });

    const now = new Date().toISOString();

    if (Array.isArray(existingViews) && existingViews.length > 0) {
      // Atualizar contagem de visualização existente para hoje
      const viewEntry = existingViews[0];
      const updatedCount = (viewEntry.count || 0) + 1;
      
      await api.patch(`/site-views/${viewEntry.id}`, {
        ...viewEntry,
        count: updatedCount,
        lastUpdated: now
      });
      
      return {
        ...viewEntry,
        count: updatedCount,
        lastUpdated: now
      };
    } else {
      // Criar nova entrada de visualização para hoje
      const newViewEntry = {
        date: today,
        count: 1,
        lastUpdated: now
      };
      
      const { data } = await api.post('/site-views', newViewEntry);
      return data;
    }
  } catch (error) {
    console.error('Erro ao rastrear visualização do site:', error);
    // Não lançar pois esta é uma operação não crítica
    return null;
  }
};

// Obter total de visualizações do site
export const getTotalSiteViews = async () => {
  try {
    const { data: siteViews } = await api.get('/site-views');
    
    if (!Array.isArray(siteViews)) {
      return 0;
    }
    
    return siteViews.reduce((total, view) => total + (view.count || 0), 0);
  } catch (error) {
    console.error('Erro ao obter total de visualizações do site:', error);
    return 0;
  }
};

// Obter visualizações diárias do site para um intervalo de datas
export const getDailySiteViews = async (startDate: string, endDate: string) => {
  try {
    // Consultar visualizações do site dentro do intervalo de datas
    const { data: siteViews } = await api.get('/site-views', {
      params: {
        date_gte: startDate,
        date_lte: endDate,
        _sort: 'date',
        _order: 'asc'
      }
    });
    
    return Array.isArray(siteViews) ? siteViews : [];
  } catch (error) {
    console.error('Erro ao obter visualizações diárias do site:', error);
    return [];
  }
};

// Obter visualizações de artigos para um artigo específico
export const getArticleViews = async (articleId: string) => {
  try {
    const { data: views } = await api.get('/views', {
      params: { articleId }
    });
    
    if (Array.isArray(views) && views.length > 0) {
      return views[0].count || 0;
    }
    
    return 0;
  } catch (error) {
    console.error(`Erro ao obter visualizações para artigo ${articleId}:`, error);
    return 0;
  }
};

// Obter artigos mais visualizados
export const getMostViewedArticles = async (limit = 5) => {
  try {
    const { data: views } = await api.get('/views', {
      params: {
        _sort: 'count',
        _order: 'desc',
        _limit: limit
      }
    });
    
    return Array.isArray(views) ? views : [];
  } catch (error) {
    console.error('Erro ao obter artigos mais visualizados:', error);
    return [];
  }
};
