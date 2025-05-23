
import { useState, useEffect } from 'react';
import { Comment, isCommentLiked } from '@/services/commentService';
import { User } from '@/components/Layout';

export function useLikedComments(comments: Comment[], currentUser: User | null) {
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Função para extrair todos os IDs de comentários, incluindo respostas
  const getAllCommentIds = (comments: Comment[]) => {
    const ids: string[] = [];
    
    // Função recursiva para coletar todos os IDs
    const collectIds = (commentList: Comment[]) => {
      for (const comment of commentList) {
        if (comment.id) {
          ids.push(comment.id);
        }
        
        // Verificar se o comentário tem respostas e se são um array antes de processar
        if (comment.replies && Array.isArray(comment.replies)) {
          collectIds(comment.replies);
        }
      }
    };
    
    collectIds(comments);
    return ids;
  };
  
  useEffect(() => {
    const checkLikedComments = async () => {
      if (!currentUser || comments.length === 0) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      const liked: Record<string, boolean> = {};
      
      try {
        // Obter todos os IDs de comentários, incluindo respostas
        const commentIds = getAllCommentIds(comments);
        const uniqueCommentIds = Array.from(new Set(
          commentIds.filter(id => id != null) as string[]
        ));
        
        // Processar em lotes de 10 para evitar muitas solicitações simultâneas
        const batchSize = 10;
        for (let i = 0; i < uniqueCommentIds.length; i += batchSize) {
          const batch = uniqueCommentIds.slice(i, i + batchSize);
          
          const results = await Promise.all(
            batch.map(async (commentId) => {
              try {
                const isLiked = await isCommentLiked(commentId, currentUser.id);
                return { id: commentId, isLiked };
              } catch (error) {
                console.error(`Erro ao verificar se o comentário ${commentId} foi curtido:`, error);
                return { id: commentId, isLiked: false };
              }
            })
          );
          
          results.forEach(result => {
            if (result && result.id) {
              liked[result.id] = result.isLiked;
            }
          });
        }
      } catch (error) {
        console.error('Erro ao verificar comentários curtidos:', error);
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
