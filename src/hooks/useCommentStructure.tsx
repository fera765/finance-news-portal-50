
import { useMemo } from 'react';
import { Comment } from '@/services/commentService';

interface CommentStructure {
  rootComments: Comment[];
  getReplies: (commentId: string) => Comment[];
  commentsByParent: Record<string, Comment[]>;
}

export function useCommentStructure(comments: Comment[] = []): CommentStructure {
  const commentStructure = useMemo(() => {
    // Group comments by parent
    const commentsByParent = comments.reduce<Record<string, Comment[]>>((acc, comment) => {
      // Usar uma chave consistente para comentários raiz
      const parentId = comment.parentId || 'root';
      
      if (!acc[parentId]) {
        acc[parentId] = [];
      }
      acc[parentId].push(comment);
      return acc;
    }, {});
    
    // Get root comments (sort by newest first)
    const rootComments = (commentsByParent['root'] || []).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    // Function to get replies for a comment (sort by oldest first for replies)
    const getReplies = (commentId: string): Comment[] => {
      const replies = commentsByParent[commentId] || [];
      return replies.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    };
    
    return {
      rootComments,
      getReplies,
      commentsByParent
    };
  }, [comments]);
  
  return commentStructure;
}
