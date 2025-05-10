
import { api } from './api';

export interface Comment {
  id?: string;
  articleId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export const getComments = async (articleId: string) => {
  const { data } = await api.get('/comments', {
    params: { articleId },
  });
  return data;
};

export const addComment = async (comment: Omit<Comment, 'id' | 'createdAt'>) => {
  const { data } = await api.post('/comments', {
    ...comment,
    createdAt: new Date().toISOString(),
  });
  return data;
};

export const deleteComment = async (id: string) => {
  await api.delete(`/comments/${id}`);
  return true;
};
