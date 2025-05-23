
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

// Track article view
export const trackArticleView = async (articleId: string) => {
  try {
    // Check if there's already a view entry for this article
    const { data: existingViews } = await api.get('/views', {
      params: { articleId },
    });

    const now = new Date().toISOString();

    if (Array.isArray(existingViews) && existingViews.length > 0) {
      // Update existing view count
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
      // Create new view entry
      const newViewEntry = {
        articleId,
        count: 1,
        lastUpdated: now
      };
      
      const { data } = await api.post('/views', newViewEntry);
      return data;
    }
  } catch (error) {
    console.error(`Error tracking view for article ${articleId}:`, error);
    // Don't throw as this is a non-critical operation
    return null;
  }
};

// Track site view
export const trackSiteView = async () => {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Check if there's already a view entry for today
    const { data: existingViews } = await api.get('/site-views', {
      params: { date: today },
    });

    const now = new Date().toISOString();

    if (Array.isArray(existingViews) && existingViews.length > 0) {
      // Update existing view count for today
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
      // Create new view entry for today
      const newViewEntry = {
        date: today,
        count: 1,
        lastUpdated: now
      };
      
      const { data } = await api.post('/site-views', newViewEntry);
      return data;
    }
  } catch (error) {
    console.error('Error tracking site view:', error);
    // Don't throw as this is a non-critical operation
    return null;
  }
};

// Get total site views
export const getTotalSiteViews = async () => {
  try {
    const { data: siteViews } = await api.get('/site-views');
    
    if (!Array.isArray(siteViews)) {
      return 0;
    }
    
    return siteViews.reduce((total, view) => total + (view.count || 0), 0);
  } catch (error) {
    console.error('Error getting total site views:', error);
    return 0;
  }
};

// Get daily site views for a date range
export const getDailySiteViews = async (startDate: string, endDate: string) => {
  try {
    // Query for site views within the date range
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
    console.error('Error getting daily site views:', error);
    return [];
  }
};

// Get article views for a specific article
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
    console.error(`Error getting views for article ${articleId}:`, error);
    return 0;
  }
};

// Get most viewed articles
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
    console.error('Error getting most viewed articles:', error);
    return [];
  }
};
