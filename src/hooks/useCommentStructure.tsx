
import { useMemo } from 'react';
import { Comment } from '@/services/commentService';

export function useCommentStructure(comments: Comment[] = []) {
  const commentStructure = useMemo(() => {
    // Group comments by parent
    const commentsByParent = comments.reduce((acc, comment) => {
      const parentId = comment.parentId || 'root';
      if (!acc[parentId]) {
        acc[parentId] = [];
      }
      acc[parentId].push(comment);
      return acc;
    }, {} as Record<string, Comment[]>);
    
    // Get root comments
    const rootComments = commentsByParent['root'] || [];
    
    // Function to get replies for a comment
    const getReplies = (commentId: string) => commentsByParent[commentId] || [];
    
    return {
      rootComments,
      getReplies
    };
  }, [comments]);
  
  return commentStructure;
}
