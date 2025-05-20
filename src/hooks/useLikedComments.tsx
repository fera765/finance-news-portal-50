
import { useState, useEffect } from 'react';
import { Comment, isCommentLiked } from '@/services/commentService';
import { User } from '@/components/Layout';

export function useLikedComments(comments: Comment[], currentUser: User | null) {
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    const checkLikedComments = async () => {
      if (!currentUser || comments.length === 0) return;
      
      const liked: Record<string, boolean> = {};
      
      for (const comment of comments) {
        if (comment.id) {
          try {
            const isLiked = await isCommentLiked(comment.id, currentUser.id);
            liked[comment.id] = isLiked;
          } catch (error) {
            console.error(`Error checking if comment ${comment.id} is liked:`, error);
          }
        }
      }
      
      setLikedComments(liked);
    };
    
    checkLikedComments();
  }, [comments, currentUser]);

  return {
    likedComments,
    isCommentLiked: (commentId: string) => likedComments[commentId] || false,
    setCommentLiked: (commentId: string, isLiked: boolean) => {
      setLikedComments(prev => ({
        ...prev,
        [commentId]: isLiked
      }));
    }
  };
}
