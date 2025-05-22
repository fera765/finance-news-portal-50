
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
    }
    return true;
  } catch (error) {
    console.error(`Error deleting likes for comment ${commentId}:`, error);
    throw error;
  }
};

// Função auxiliar para buscar todas as respostas a um comentário
const findReplies = async (commentId: string): Promise<string[]> => {
  try {
    const { data: replies } = await api.get('/comments', {
      params: { parentId: commentId }
    });
    
    if (!replies || replies.length === 0) {
      return [];
    }
    
    // Coletar IDs de todas as respostas e suas respostas recursivamente
    let replyIds = replies.map((reply: Comment) => reply.id as string);
    
    // Para cada resposta, encontrar suas próprias respostas recursivamente
    const childPromises = replies.map((reply: Comment) => 
      findReplies(reply.id as string)
    );
    
    // Aguardar todas as promessas e aplainar os resultados
    const childResults = await Promise.all(childPromises);
    const childIds = childResults.flat();
    
    // Combinar IDs diretos e indiretos
    return [...replyIds, ...childIds];
  } catch (error) {
    console.error(`Error finding replies for comment ${commentId}:`, error);
    return [];
  }
};

// Função recursiva para excluir comentários em cascata
const deleteCommentAndReplies = async (commentId: string) => {
  try {
    console.log(`Starting deletion process for comment ${commentId}`);
    
    // Primeiro, encontrar todos os IDs de respostas (diretas e indiretas)
    const replyIds = await findReplies(commentId);
    console.log(`Found ${replyIds.length} replies to delete for comment ${commentId}`);
    
    // Excluir os likes de todas as respostas (incluindo o comentário original)
    const allIds = [commentId, ...replyIds];
    console.log(`Processing likes deletion for ${allIds.length} comments`);
    
    for (const id of allIds) {
      await deleteCommentLikes(id);
      console.log(`Deleted likes for comment/reply ${id}`);
    }
    
    // Excluir todas as respostas em ordem reversa (das mais profundas para as mais superficiais)
    if (replyIds.length > 0) {
      // Reversed order to delete deepest replies first
      for (const replyId of [...replyIds].reverse()) {
        await api.delete(`/comments/${replyId}`);
        console.log(`Deleted reply ${replyId}`);
      }
    }
    
    // Por fim, excluir o comentário principal
    await api.delete(`/comments/${commentId}`);
    console.log(`Deleted main comment ${commentId}`);
    
    return true;
  } catch (error) {
    console.error(`Error recursively deleting comment ${commentId}:`, error);
    throw error;
  }
};

export const deleteComment = async (id: string) => {
  try {
    // Utiliza a função otimizada para excluir o comentário e todas as suas respostas
    return await deleteCommentAndReplies(id);
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
