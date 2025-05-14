
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getComments, addComment, deleteComment, Comment } from '@/services/commentService';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export function useComments(articleId: string | undefined) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Buscar comentários
  const {
    data: comments = [],
    isLoading,
    isError
  } = useQuery({
    queryKey: ['comments', articleId],
    queryFn: () => articleId ? getComments(articleId) : [],
    enabled: !!articleId
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
    onError: () => {
      toast.error('Falha ao adicionar comentário');
    }
  });

  // Mutação para deletar comentário
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      toast.success('Comentário excluído');
      queryClient.invalidateQueries({ queryKey: ['comments', articleId] });
    },
    onError: () => {
      toast.error('Falha ao excluir comentário');
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
    onError: () => {
      toast.error('Falha ao adicionar resposta');
    }
  });

  return {
    comments,
    isLoading,
    isError,
    addComment: addCommentMutation.mutate,
    deleteComment: deleteCommentMutation.mutate,
    replyToComment: replyToCommentMutation.mutate,
    isAddingComment: addCommentMutation.isPending,
    isDeletingComment: deleteCommentMutation.isPending,
    isReplyingToComment: replyToCommentMutation.isPending
  };
}
