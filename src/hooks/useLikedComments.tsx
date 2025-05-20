
import { useState, useEffect } from 'react';
import { Comment, isCommentLiked } from '@/services/commentService';
import { User } from '@/components/Layout';

export function useLikedComments(comments: Comment[], currentUser: User | null) {
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkLikedComments = async () => {
      if (!currentUser || comments.length === 0) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      const liked: Record<string, boolean> = {};
      
      try {
        // Processar em lotes de 10 para evitar muitas requisições simultâneas
        const batchSize = 10;
        for (let i = 0; i < comments.length; i += batchSize) {
          const batch = comments.slice(i, i + batchSize);
          
          const results = await Promise.all(
            batch.map(async (comment) => {
              if (comment.id) {
                try {
                  const isLiked = await isCommentLiked(comment.id, currentUser.id);
                  return { id: comment.id, isLiked };
                } catch (error) {
                  console.error(`Error checking if comment ${comment.id} is liked:`, error);
                  return { id: comment.id, isLiked: false };
                }
              }
              return null;
            })
          );
          
          results.forEach(result => {
            if (result && result.id) {
              liked[result.id] = result.isLiked;
            }
          });
        }
      } catch (error) {
        console.error('Error checking liked comments:', error);
      } finally {
        setLikedComments(liked);
        setIsLoading(false);
      }
    };
    
    checkLikedComments();
  }, [comments, currentUser]);

  return {
    likedComments,
    isLoading,
    isCommentLiked: (commentId: string) => likedComments[commentId] || false,
    setCommentLiked: (commentId: string, isLiked: boolean) => {
      setLikedComments(prev => ({
        ...prev,
        [commentId]: isLiked
      }));
    }
  };
}
