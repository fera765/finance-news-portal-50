
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
  const { data } = await api.get('/comments', {
    params: { articleId },
  });
  return data;
};

export const addComment = async (comment: Omit<Comment, 'id' | 'createdAt' | 'likes'>) => {
  const { data } = await api.post('/comments', {
    ...comment,
    createdAt: new Date().toISOString(),
    likes: 0
  });
  return data;
};

export const updateComment = async (id: string, content: string) => {
  const { data: comment } = await api.get(`/comments/${id}`);
  const { data } = await api.patch(`/comments/${id}`, {
    ...comment,
    content
  });
  return data;
};

export const deleteComment = async (id: string) => {
  await api.delete(`/comments/${id}`);
  return true;
};

export const likeComment = async (id: string, userId: string) => {
  // Primeiro verifica se o usuário já curtiu este comentário
  const { data: existingLikes } = await api.get('/comment-likes', {
    params: { commentId: id, userId }
  });
  
  if (existingLikes.length > 0) {
    // Usuário já curtiu, remover curtida
    await api.delete(`/comment-likes/${existingLikes[0].id}`);
    
    // Atualizar o contador de curtidas do comentário
    const { data: comment } = await api.get(`/comments/${id}`);
    await api.patch(`/comments/${id}`, {
      likes: Math.max(0, (comment.likes || 0) - 1)
    });
    
    return false;
  } else {
    // Adicionar nova curtida
    await api.post('/comment-likes', {
      commentId: id,
      userId,
      createdAt: new Date().toISOString()
    });
    
    // Atualizar o contador de curtidas do comentário
    const { data: comment } = await api.get(`/comments/${id}`);
    await api.patch(`/comments/${id}`, {
      likes: (comment.likes || 0) + 1
    });
    
    return true;
  }
};

export const isCommentLiked = async (id: string, userId: string) => {
  const { data } = await api.get('/comment-likes', {
    params: { commentId: id, userId }
  });
  return data.length > 0;
};
