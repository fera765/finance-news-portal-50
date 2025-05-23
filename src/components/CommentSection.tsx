
import { useState } from "react";
import { Comment } from "@/services/commentService";
import { User } from "@/components/Layout";
import { CommentForm } from "./comments/CommentForm";
import { CommentItem } from "./comments/CommentItem";
import { DeleteCommentDialog } from "./comments/DeleteCommentDialog";
import { useComments } from "@/hooks/useComments";
import { useLikedComments } from "@/hooks/useLikedComments";
import { useCommentStructure } from "@/hooks/useCommentStructure";
import { useCommentAuthors } from "@/hooks/useCommentAuthors";
import { toast } from "sonner";

interface CommentSectionProps {
  newsId: string;
  comments: Comment[];
  currentUser?: User | null;
  onLogin: () => void;
}

const CommentSection = ({ 
  newsId, 
  comments, 
  currentUser,
  onLogin
}: CommentSectionProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  
  // Usar nossos hooks personalizados
  const { rootComments, getReplies } = useCommentStructure(comments);
  const { commentAuthors, getAuthorInfo } = useCommentAuthors(comments);
  const { likedComments, isCommentLiked, setCommentLiked } = useLikedComments(comments, currentUser);
  
  // Usar nosso hook de comentários para operações CRUD
  const { 
    addComment, 
    replyToComment, 
    deleteComment, 
    updateComment,
    likeComment,
    isAddingComment, 
    isReplyingToComment,
    isDeletingComment,
    isUpdatingComment,
    isLikingComment
  } = useComments(newsId);

  const handleAddComment = (content: string) => {
    addComment(content);
  };

  const handleReplyToComment = (commentId: string, content: string) => {
    replyToComment({ commentId, content });
  };

  const handleUpdateComment = (commentId: string, content: string) => {
    updateComment({ commentId, content });
  };

  const handleLikeComment = async (commentId: string) => {
    if (!currentUser) {
      onLogin();
      return false; // Retornar false quando o usuário não estiver logado
    }
    
    try {
      // Usar a função likeComment do hook useComments
      const result = await likeComment(commentId, currentUser.id);
      
      // Alternar o estado do like localmente para feedback imediato
      setCommentLiked(commentId, result);
      
      return true; // Retornar true em operação de like bem-sucedida
    } catch (error) {
      console.error("Erro ao curtir comentário:", error);
      toast.error("Erro: Não foi possível processar sua solicitação");
      return false; // Retornar false em erro
    }
  };

  const confirmDeleteComment = (commentId: string) => {
    setCommentToDelete(commentId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;
    
    try {
      // Excluir o comentário com tratamento de erro aprimorado
      await deleteComment(commentToDelete);
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
    } catch (error) {
      console.error("Erro ao excluir comentário:", error);
      toast.error("Erro: Não foi possível excluir o comentário. Tente novamente.");
    }
  };

  // Melhorar comentários com informações do autor
  const enhanceComment = (comment: Comment) => {
    const author = getAuthorInfo(comment.userId);
    return {
      ...comment,
      userName: author.name,
      userAvatar: author.avatar
    };
  };

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold mb-6">Comentários</h3>
      
      <CommentForm
        onSubmit={handleAddComment}
        isSubmitting={isAddingComment}
        currentUser={currentUser}
        onLogin={onLogin}
      />
      
      <div className="space-y-6">
        {rootComments.length === 0 ? (
          <p className="text-center text-gray-500 py-6">
            Seja o primeiro a comentar neste artigo!
          </p>
        ) : (
          rootComments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={enhanceComment(comment)}
              replies={getReplies(comment.id!).map(reply => {
                const enhancedReply = enhanceComment(reply);
                return enhancedReply;
              })}
              currentUser={currentUser}
              isLiked={isCommentLiked(comment.id!)}
              onLike={handleLikeComment}
              onReply={handleReplyToComment}
              onEdit={handleUpdateComment}
              onDelete={confirmDeleteComment}
              isUpdatingComment={isUpdatingComment}
              isReplyingToComment={isReplyingToComment}
              getCommentLikedStatus={isCommentLiked}
            />
          ))
        )}
      </div>
      
      {/* Diálogo de Confirmação de Exclusão */}
      <DeleteCommentDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteComment}
        isDeleting={isDeletingComment}
      />
    </div>
  );
};

export default CommentSection;
