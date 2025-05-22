
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getComments, addComment, deleteComment, Comment, updateComment as updateCommentService, likeComment as likeCommentService } from '@/services/commentService';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export function useComments(articleId: string | undefined) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch comments
  const {
    data: comments = [],
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['comments', articleId],
    queryFn: () => articleId ? getComments(articleId) : [],
    enabled: !!articleId,
    staleTime: 60000, // 1 minute
    retry: 2,
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching comments:', error);
        toast.error('Não foi possível carregar os comentários. Tente novamente mais tarde.');
      }
    }
  });

  // Mutation to add comment
  const addCommentMutation = useMutation({
    mutationFn: (content: string) => {
      if (!user || !articleId) throw new Error('Não é possível adicionar comentário');
      return addComment({
        articleId,
        userId: user.id,
        content
      });
    },
    onSuccess: () => {
      toast.success('Comentário adicionado com sucesso');
      queryClient.invalidateQueries({ queryKey: ['comments', articleId] });
    },
    onError: (error) => {
      console.error('Error adding comment:', error);
      toast.error('Falha ao adicionar comentário. Tente novamente.');
    }
  });

  // Mutation to delete comment
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      toast.success('Comentário excluído');
      queryClient.invalidateQueries({ queryKey: ['comments', articleId] });
    },
    onError: (error) => {
      console.error('Error deleting comment:', error);
      toast.error('Falha ao excluir comentário. Tente novamente.');
    }
  });

  // Mutation to reply to a comment
  const replyToCommentMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: string, content: string }) => {
      if (!user || !articleId) throw new Error('Não é possível adicionar resposta');
      return addComment({
        articleId,
        userId: user.id,
        content,
        parentId: commentId
      });
    },
    onSuccess: () => {
      toast.success('Resposta adicionada com sucesso');
      queryClient.invalidateQueries({ queryKey: ['comments', articleId] });
    },
    onError: (error) => {
      console.error('Error adding reply:', error);
      toast.error('Falha ao adicionar resposta. Tente novamente.');
    }
  });

  // Mutation to update a comment
  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: string, content: string }) => {
      if (!user) throw new Error('Não é possível editar o comentário');
      return updateCommentService(commentId, content);
    },
    onSuccess: () => {
      toast.success('Comentário atualizado com sucesso');
      queryClient.invalidateQueries({ queryKey: ['comments', articleId] });
    },
    onError: (error) => {
      console.error('Error updating comment:', error);
      toast.error('Falha ao atualizar comentário. Tente novamente.');
    }
  });

  // Mutation to like/unlike a comment
  const likeCommentMutation = useMutation({
    mutationFn: ({ commentId, userId }: { commentId: string, userId: string }) => {
      return likeCommentService(commentId, userId);
    },
    onSuccess: (isLiked, { commentId }) => {
      // Update local state immediately
      queryClient.setQueryData(['comments', articleId], (oldData: Comment[] | undefined) => {
        if (!oldData) return [];
        return oldData.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              likes: isLiked ? (comment.likes || 0) + 1 : Math.max(0, (comment.likes || 0) - 1)
            };
          }
          return comment;
        });
      });
      
      // Also invalidate to make sure data stays consistent
      queryClient.invalidateQueries({ queryKey: ['comments', articleId] });
      
      toast.success(isLiked ? 'Comentário curtido' : 'Curtida removida');
    },
    onError: (error) => {
      console.error('Error liking/unliking comment:', error);
      toast.error('Falha ao processar curtida. Tente novamente.');
    }
  });

  // Update comments list manually
  const refreshComments = () => {
    return refetch();
  };

  return {
    comments,
    isLoading,
    isError,
    refreshComments,
    addComment: addCommentMutation.mutate,
    deleteComment: deleteCommentMutation.mutate,
    replyToComment: replyToCommentMutation.mutate,
    updateComment: updateCommentMutation.mutate,
    likeComment: (commentId: string, userId: string) => likeCommentMutation.mutate({ commentId, userId }),
    isAddingComment: addCommentMutation.isPending,
    isDeletingComment: deleteCommentMutation.isPending,
    isReplyingToComment: replyToCommentMutation.isPending,
    isUpdatingComment: updateCommentMutation.isPending,
    isLikingComment: likeCommentMutation.isPending
  };
}
