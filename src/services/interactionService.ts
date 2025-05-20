
import { api } from './api';

export interface Like {
  id?: string;
  articleId: string;
  userId: string;
  createdAt: string;
}

export interface Bookmark {
  id?: string;
  articleId: string;
  userId: string;
  createdAt: string;
}

// Like related operations
export const getLikes = async (articleId?: string | null, userId?: string | null) => {
  const params: Record<string, string> = {};
  
  if (articleId) params.articleId = articleId;
  if (userId) params.userId = userId;
  
  const { data } = await api.get('/likes', { params });
  return data;
};

export const likeArticle = async (articleId: string, userId: string) => {
  // Check if the user already liked this article
  const { data: existingLikes } = await api.get('/likes', {
    params: { articleId, userId },
  });

  if (existingLikes.length > 0) {
    return existingLikes[0];
  }

  // Create new like with timestamp
  const { data } = await api.post('/likes', {
    articleId,
    userId,
    createdAt: new Date().toISOString()
  });
  
  // Update article metrics if needed
  try {
    const { data: viewData } = await api.get('/views', {
      params: { articleId }
    });
    
    if (viewData && viewData.length > 0) {
      const currentView = viewData[0];
      if (!currentView.likes) currentView.likes = 0;
      currentView.likes++;
      
      await api.patch(`/views/${currentView.id}`, currentView);
    }
  } catch (error) {
    console.error('Error updating article metrics:', error);
  }
  
  return data;
};

export const unlikeArticle = async (articleId: string, userId: string) => {
  // Find the like to delete
  const { data: likes } = await api.get('/likes', {
    params: { articleId, userId },
  });

  if (likes.length > 0) {
    await api.delete(`/likes/${likes[0].id}`);
    
    // Update article metrics if needed
    try {
      const { data: viewData } = await api.get('/views', {
        params: { articleId }
      });
      
      if (viewData && viewData.length > 0) {
        const currentView = viewData[0];
        if (currentView.likes && currentView.likes > 0) {
          currentView.likes--;
          await api.patch(`/views/${currentView.id}`, currentView);
        }
      }
    } catch (error) {
      console.error('Error updating article metrics:', error);
    }
  }
  
  return true;
};

export const checkIfLiked = async (articleId: string, userId: string) => {
  const { data } = await api.get('/likes', {
    params: { articleId, userId },
  });
  return data.length > 0;
};

// Bookmark related operations
export const getBookmarks = async (userId: string) => {
  const { data } = await api.get('/bookmarks', {
    params: { userId },
  });
  return data;
};

export const bookmarkArticle = async (articleId: string, userId: string) => {
  // Check if the user already bookmarked this article
  const { data: existingBookmarks } = await api.get('/bookmarks', {
    params: { articleId, userId },
  });

  if (existingBookmarks.length > 0) {
    return existingBookmarks[0];
  }

  // Create new bookmark with timestamp
  const { data } = await api.post('/bookmarks', {
    articleId,
    userId,
    createdAt: new Date().toISOString()
  });
  return data;
};

export const removeBookmark = async (articleId: string, userId: string) => {
  // Find the bookmark to delete
  const { data: bookmarks } = await api.get('/bookmarks', {
    params: { articleId, userId },
  });

  if (bookmarks.length > 0) {
    await api.delete(`/bookmarks/${bookmarks[0].id}`);
  }
  
  return true;
};

export const checkIfBookmarked = async (articleId: string, userId: string) => {
  const { data } = await api.get('/bookmarks', {
    params: { articleId, userId },
  });
  return data.length > 0;
};

// Get all user interactions with articles for efficient display
export const getUserArticleInteractions = async (userId: string) => {
  if (!userId) return { likes: [], bookmarks: [] };
  
  const [likes, bookmarks] = await Promise.all([
    getLikes(null, userId),
    getBookmarks(userId)
  ]);
  
  return { likes, bookmarks };
};
