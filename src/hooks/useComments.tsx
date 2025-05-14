
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getComments, addComment, deleteComment, Comment } from '@/services/commentService';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export function useComments(articleId: string | undefined) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch comments
  const {
    data: comments = [],
    isLoading,
    isError
  } = useQuery({
    queryKey: ['comments', articleId],
    queryFn: () => articleId ? getComments(articleId) : [],
    enabled: !!articleId
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: (content: string) => {
      if (!user || !articleId) throw new Error('Cannot add comment');
      return addComment({
        articleId,
        userId: user.id,
        content
      });
    },
    onSuccess: () => {
      toast.success('Comment added successfully');
      queryClient.invalidateQueries({ queryKey: ['comments', articleId] });
    },
    onError: () => {
      toast.error('Failed to add comment');
    }
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      toast.success('Comment deleted');
      queryClient.invalidateQueries({ queryKey: ['comments', articleId] });
    },
    onError: () => {
      toast.error('Failed to delete comment');
    }
  });

  return {
    comments,
    isLoading,
    isError,
    addComment: addCommentMutation.mutate,
    deleteComment: deleteCommentMutation.mutate,
    isAddingComment: addCommentMutation.isPending,
    isDeletingComment: deleteCommentMutation.isPending
  };
}
