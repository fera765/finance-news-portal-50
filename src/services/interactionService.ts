import { api } from './api';

export interface Like {
  id?: string;
  articleId: string;
  userId: string;
}

export interface Bookmark {
  id?: string;
  articleId: string;
  userId: string;
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

  const { data } = await api.post('/likes', {
    articleId,
    userId,
  });
  return data;
};

export const unlikeArticle = async (articleId: string, userId: string) => {
  // Find the like to delete
  const { data: likes } = await api.get('/likes', {
    params: { articleId, userId },
  });

  if (likes.length > 0) {
    await api.delete(`/likes/${likes[0].id}`);
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

  const { data } = await api.post('/bookmarks', {
    articleId,
    userId,
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
