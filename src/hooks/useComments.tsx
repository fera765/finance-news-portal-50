
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getComments, addComment, deleteComment, Comment, updateComment as updateCommentService } from '@/services/commentService';
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
    onError: (error) => {
      console.error('Error fetching comments:', error);
      toast.error('Não foi possível carregar os comentários. Tente novamente mais tarde.');
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
    isAddingComment: addCommentMutation.isPending,
    isDeletingComment: deleteCommentMutation.isPending,
    isReplyingToComment: replyToCommentMutation.isPending,
    isUpdatingComment: updateCommentMutation.isPending
  };
}
