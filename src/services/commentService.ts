
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
      params: { 
        articleId,
        _sort: 'createdAt',
        _order: 'desc'
      },
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
      content,
      updatedAt: new Date().toISOString()
    });
    return data;
  } catch (error) {
    console.error(`Error updating comment ${id}:`, error);
    throw error;
  }
};

export const deleteComment = async (id: string) => {
  try {
    // First check if there are replies to this comment
    const { data: replies } = await api.get('/comments', {
      params: { parentId: id }
    });
    
    // If there are replies, mark the comment as deleted but don't actually remove it
    if (replies && replies.length > 0) {
      const { data: comment } = await api.get(`/comments/${id}`);
      await api.patch(`/comments/${id}`, {
        ...comment,
        content: "[Comentário removido]",
        deletedAt: new Date().toISOString(),
        isDeleted: true
      });
    } else {
      // If no replies, we can safely delete the comment
      await api.delete(`/comments/${id}`);
      
      // Also delete any likes associated with this comment
      const { data: commentLikes } = await api.get('/comment-likes', {
        params: { commentId: id }
      });
      
      for (const like of commentLikes) {
        await api.delete(`/comment-likes/${like.id}`);
      }
    }
    
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

// Get comment replies (children comments)
export const getCommentReplies = async (parentId: string) => {
  try {
    const { data } = await api.get('/comments', {
      params: { 
        parentId,
        _sort: 'createdAt',
        _order: 'asc'
      },
    });
    return data;
  } catch (error) {
    console.error(`Error fetching replies for comment ${parentId}:`, error);
    return [];
  }
};

// Check if user can edit/delete a comment (user is author)
export const canModifyComment = (comment: Comment, userId: string | undefined): boolean => {
  if (!userId) return false;
  return comment.userId === userId;
};
