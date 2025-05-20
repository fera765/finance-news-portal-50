
import { api } from './api';

export interface Comment {
  id?: string;
  articleId: string;
  userId: string;
  content: string;
  createdAt: string;
  parentId?: string;
  likes?: number;
}

export const getComments = async (articleId: string) => {
  try {
    const { data } = await api.get('/comments', {
      params: { articleId },
    });
    return data;
  } catch (error) {
    console.error(`Error fetching comments for article ${articleId}:`, error);
    return [];
  }
};

export const addComment = async (comment: Omit<Comment, 'id' | 'createdAt' | 'likes'>) => {
  try {
    const { data } = await api.post('/comments', {
      ...comment,
      createdAt: new Date().toISOString(),
      likes: 0
    });
    return data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const updateComment = async (id: string, content: string) => {
  try {
    const { data: comment } = await api.get(`/comments/${id}`);
    const { data } = await api.patch(`/comments/${id}`, {
      ...comment,
      content
    });
    return data;
  } catch (error) {
    console.error(`Error updating comment ${id}:`, error);
    throw error;
  }
};

export const deleteComment = async (id: string) => {
  try {
    await api.delete(`/comments/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting comment ${id}:`, error);
    throw error;
  }
};

export const likeComment = async (id: string, userId: string) => {
  try {
    // First check if the user already liked this comment
    const { data: existingLikes } = await api.get('/comment-likes', {
      params: { commentId: id, userId }
    });
    
    if (existingLikes.length > 0) {
      // User already liked, remove like
      await api.delete(`/comment-likes/${existingLikes[0].id}`);
      
      // Update comment like count
      const { data: comment } = await api.get(`/comments/${id}`);
      await api.patch(`/comments/${id}`, {
        ...comment,
        likes: Math.max(0, (comment.likes || 0) - 1)
      });
      
      return false;
    } else {
      // Add new like
      await api.post('/comment-likes', {
        commentId: id,
        userId,
        createdAt: new Date().toISOString()
      });
      
      // Update comment like count
      const { data: comment } = await api.get(`/comments/${id}`);
      await api.patch(`/comments/${id}`, {
        ...comment,
        likes: (comment.likes || 0) + 1
      });
      
      return true;
    }
  } catch (error) {
    console.error(`Error toggling like for comment ${id}:`, error);
    throw error;
  }
};

export const isCommentLiked = async (id: string, userId: string) => {
  try {
    const { data } = await api.get('/comment-likes', {
      params: { commentId: id, userId }
    });
    return data.length > 0;
  } catch (error) {
    console.error(`Error checking if comment ${id} is liked by user ${userId}:`, error);
    return false;
  }
};
