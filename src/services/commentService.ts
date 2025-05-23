
import { api } from './api';

export interface Comment {
  id?: string;
  articleId: string;
  userId: string;
  content: string;
  createdAt: string;
  parentId?: string;
  likes?: number;
  userName?: string;
  userAvatar?: string;
  replies?: Comment[]; // Add replies property to support nested comments
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

// Função auxiliar para excluir likes de um comentário
const deleteCommentLikes = async (commentId: string) => {
  try {
    const { data: commentLikes } = await api.get('/comment-likes', {
      params: { commentId }
    });
    
    // Uso de Promise.all para paralelizar as requisições de exclusão
    if (commentLikes && commentLikes.length > 0) {
      const deletionPromises = commentLikes.map(like => 
        api.delete(`/comment-likes/${like.id}`)
      );
      
      await Promise.all(deletionPromises);
      console.log(`Successfully deleted ${commentLikes.length} likes for comment ${commentId}`);
    }
    return true;
  } catch (error) {
    console.error(`Error deleting likes for comment ${commentId}:`, error);
    throw error;
  }
};

// Função para encontrar respostas diretas a um comentário
const findDirectReplies = async (commentId: string): Promise<string[]> => {
  try {
    const { data: replies } = await api.get('/comments', {
      params: { parentId: commentId }
    });
    
    if (!replies || replies.length === 0) {
      return [];
    }
    
    return replies.map((reply: Comment) => reply.id as string);
  } catch (error) {
    console.error(`Error finding replies for comment ${commentId}:`, error);
    return [];
  }
};

// Função otimizada para excluir um comentário e suas respostas diretas
export const deleteComment = async (id: string) => {
  try {
    console.log(`Starting deletion process for comment ${id}`);
    
    // 1. Encontrar todas as respostas diretas
    const replyIds = await findDirectReplies(id);
    console.log(`Found ${replyIds.length} replies to delete for comment ${id}`);
    
    // 2. Excluir likes do comentário principal e das respostas
    await deleteCommentLikes(id);
    console.log(`Deleted likes for main comment ${id}`);
    
    // 3. Excluir likes e depois as respostas
    if (replyIds.length > 0) {
      for (const replyId of replyIds) {
        // Primeiro excluir os likes da resposta
        await deleteCommentLikes(replyId);
        console.log(`Deleted likes for reply ${replyId}`);
        
        // Depois excluir a resposta
        await api.delete(`/comments/${replyId}`);
        console.log(`Deleted reply ${replyId}`);
      }
    }
    
    // 4. Finalmente, excluir o comentário principal
    await api.delete(`/comments/${id}`);
    console.log(`Successfully deleted main comment ${id}`);
    
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
    
    if (existingLikes && existingLikes.length > 0) {
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
    if (!id || !userId) return false;
    
    const { data } = await api.get('/comment-likes', {
      params: { commentId: id, userId }
    });
    return data && data.length > 0;
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
