
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getComments, addComment, deleteComment, Comment, updateComment as updateCommentService, likeComment as likeCommentService } from '@/services/commentService';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export function useComments(articleId: string | undefined) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Buscar comentários
  const {
    data: comments = [],
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['comments', articleId],
    queryFn: () => articleId ? getComments(articleId) : [],
    enabled: !!articleId,
    staleTime: 60000, // 1 minuto
    retry: 2,
    meta: {
      onError: (error: Error) => {
        console.error('Erro ao buscar comentários:', error);
        toast.error('Não foi possível carregar os comentários. Tente novamente mais tarde.');
      }
    }
  });

  // Mutação para adicionar comentário
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
      console.error('Erro ao adicionar comentário:', error);
      toast.error('Falha ao adicionar comentário. Tente novamente.');
    }
  });

  // Mutação para excluir comentário
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      toast.success('Comentário excluído');
      queryClient.invalidateQueries({ queryKey: ['comments', articleId] });
    },
    onError: (error) => {
      console.error('Erro ao excluir comentário:', error);
      toast.error('Falha ao excluir comentário. Tente novamente.');
    }
  });

  // Mutação para responder a um comentário
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
      console.error('Erro ao adicionar resposta:', error);
      toast.error('Falha ao adicionar resposta. Tente novamente.');
    }
  });

  // Mutação para atualizar um comentário
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
      console.error('Erro ao atualizar comentário:', error);
      toast.error('Falha ao atualizar comentário. Tente novamente.');
    }
  });

  // Mutação para curtir/descurtir um comentário
  const likeCommentMutation = useMutation({
    mutationFn: ({ commentId, userId }: { commentId: string, userId: string }) => {
      return likeCommentService(commentId, userId);
    },
    onSuccess: (isLiked, { commentId }) => {
      // Atualizar o estado local imediatamente
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
      
      // Também invalidar para garantir que os dados permaneçam consistentes
      queryClient.invalidateQueries({ queryKey: ['comments', articleId] });
      
      toast.success(isLiked ? 'Comentário curtido' : 'Curtida removida');
    },
    onError: (error) => {
      console.error('Erro ao curtir/descurtir comentário:', error);
      toast.error('Falha ao processar curtida. Tente novamente.');
    }
  });

  // Atualizar lista de comentários manualmente
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
    likeComment: async (commentId: string, userId: string): Promise<boolean> => {
      try {
        const result = await likeCommentMutation.mutateAsync({ commentId, userId });
        return result;
      } catch (error) {
        console.error('Erro ao curtir/descurtir comentário:', error);
        return false;
      }
    },
    isAddingComment: addCommentMutation.isPending,
    isDeletingComment: deleteCommentMutation.isPending,
    isReplyingToComment: replyToCommentMutation.isPending,
    isUpdatingComment: updateCommentMutation.isPending,
    isLikingComment: likeCommentMutation.isPending
  };
}
