
import { useState, useEffect } from 'react';
import { Comment } from '@/services/commentService';
import { api } from '@/services/api';

export interface CommentAuthor {
  id: string;
  name: string;
  avatar?: string;
}

export function useCommentAuthors(comments: Comment[] = []) {
  const [commentAuthors, setCommentAuthors] = useState<Record<string, CommentAuthor>>({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCommentAuthors = async () => {
      if (comments.length === 0) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      const userIds = [...new Set(comments.map(comment => comment.userId))];
      const authors: Record<string, CommentAuthor> = {};
      
      for (const userId of userIds) {
        try {
          const { data: user } = await api.get(`/users/${userId}`);
          authors[userId] = {
            id: userId,
            name: user.name || `User ${userId.slice(0, 4)}`,
            avatar: user.avatar
          };
        } catch (error) {
          console.error(`Error fetching user ${userId}:`, error);
          authors[userId] = {
            id: userId,
            name: `User ${userId.slice(0, 4)}`,
            avatar: undefined
          };
        }
      }
      
      setCommentAuthors(authors);
      setLoading(false);
    };
    
    fetchCommentAuthors();
  }, [comments]);
  
  const getAuthorInfo = (userId: string): CommentAuthor => {
    return commentAuthors[userId] || {
      id: userId,
      name: `User ${userId.slice(0, 4)}`,
      avatar: undefined
    };
  };
  
  return {
    commentAuthors,
    loading,
    getAuthorInfo
  };
}
