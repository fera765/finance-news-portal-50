
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Edit, Trash2, CornerDownLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useComments } from "@/hooks/useComments";
import { Comment, likeComment, isCommentLiked } from "@/services/commentService";
import { User } from "@/components/Layout";
import { toast } from "sonner";
import { api } from "@/services/api";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CommentSectionProps {
  newsId: string;
  comments: Comment[];
  currentUser?: User | null;
  onLogin: () => void;
}

interface CommentAuthor {
  id: string;
  name: string;
  avatar?: string;
}

const CommentSection = ({ 
  newsId, 
  comments, 
  currentUser,
  onLogin
}: CommentSectionProps) => {
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [commentAuthors, setCommentAuthors] = useState<Record<string, CommentAuthor>>({});
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  
  // Use our comments hook
  const { 
    addComment, 
    replyToComment, 
    deleteComment, 
    updateComment,
    isAddingComment, 
    isReplyingToComment,
    isDeletingComment,
    isUpdatingComment
  } = useComments(newsId);

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

  // Fetch user information for all commenters
  useEffect(() => {
    const fetchCommentAuthors = async () => {
      if (comments.length === 0) return;
      
      const userIds = [...new Set(comments.map(comment => comment.userId))];
      const authors: Record<string, CommentAuthor> = {};
      
      for (const userId of userIds) {
        try {
          const { data: user } = await api.get(`/users/${userId}`);
          authors[userId] = {
            id: userId,
            name: user.name || `User ${userId.slice(0, 4)}`,
            avatar: user.avatar
          };
        } catch (error) {
          console.error(`Error fetching user ${userId}:`, error);
          authors[userId] = {
            id: userId,
            name: `User ${userId.slice(0, 4)}`,
            avatar: undefined
          };
        }
      }
      
      setCommentAuthors(authors);
    };
    
    fetchCommentAuthors();
  }, [comments]);

  // Check if comments are liked by the current user
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

  const handleComment = () => {
    if (!currentUser) {
      onLogin();
      return;
    }
    
    if (!commentText.trim()) {
      toast("O comentário não pode estar vazio");
      return;
    }
    
    // Add the comment using our hook
    addComment(commentText);
    setCommentText("");
  };

  const handleReply = (commentId: string) => {
    if (!currentUser) {
      onLogin();
      return;
    }
    
    if (!replyText.trim()) {
      toast("A resposta não pode estar vazia");
      return;
    }
    
    // Add the reply using our hook
    replyToComment({ commentId, content: replyText });
    setReplyingTo(null);
    setReplyText("");
  };

  const handleEditComment = (commentId: string) => {
    if (!currentUser) {
      onLogin();
      return;
    }
    
    // Find the comment to edit
    const comment = comments.find(c => c.id === commentId);
    if (!comment) return;
    
    // Set the edit state
    setEditingComment(commentId);
    setEditText(comment.content);
  };

  const submitEditComment = (commentId: string) => {
    if (!currentUser) {
      onLogin();
      return;
    }
    
    if (!editText.trim()) {
      toast("O comentário não pode estar vazio");
      return;
    }
    
    // Update the comment
    updateComment({ commentId, content: editText });
    setEditingComment(null);
    setEditText("");
  };

  const confirmDeleteComment = (commentId: string) => {
    setCommentToDelete(commentId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteComment = () => {
    if (!commentToDelete) return;
    
    // Delete the comment
    deleteComment(commentToDelete);
    setDeleteDialogOpen(false);
    setCommentToDelete(null);
  };

  const handleLike = async (commentId: string) => {
    if (!currentUser) {
      onLogin();
      return;
    }
    
    try {
      const isLiked = await likeComment(commentId, currentUser.id);
      
      // Update the local state
      setLikedComments(prev => ({
        ...prev,
        [commentId]: isLiked
      }));
      
      toast(isLiked 
        ? "Você curtiu este comentário" 
        : "Você descurtiu este comentário");
    } catch (error) {
      console.error("Error liking comment:", error);
      toast("Erro: Não foi possível processar sua solicitação");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  const getAuthorInfo = (userId: string): CommentAuthor => {
    return commentAuthors[userId] || {
      id: userId,
      name: `User ${userId.slice(0, 4)}`,
      avatar: `https://i.pravatar.cc/150?u=${userId}`
    };
  };

  // Recursive function to render comments with replies
  const renderComment = (comment: Comment, level = 0) => {
    const author = getAuthorInfo(comment.userId);
    const isLiked = likedComments[comment.id || ''] || false;
    const isCurrentUserAuthor = currentUser && comment.userId === currentUser.id;
    const replies = comment.id ? commentsByParent[comment.id] || [] : [];
    
    return (
      <div key={comment.id} 
        className={`bg-gray-50 p-4 rounded-lg mb-3 ${level > 0 ? 'ml-6 border-l-2 border-gray-200' : ''}`}>
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarImage src={author.avatar} />
            <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium">{author.name}</span>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(comment.createdAt), { 
                  addSuffix: true,
                  locale: ptBR
                })}
              </span>
            </div>
            
            {editingComment === comment.id ? (
              <div className="mt-2">
                <Textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="resize-none text-sm mb-2"
                  rows={3}
                  disabled={isUpdatingComment}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingComment(null)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => comment.id && submitEditComment(comment.id)}
                    disabled={!editText.trim() || isUpdatingComment}
                  >
                    {isUpdatingComment ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700">{comment.content}</p>
            )}
            
            <div className="flex items-center gap-4 mt-2 flex-wrap">
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-auto"
                onClick={() => comment.id && handleLike(comment.id)}
              >
                <Heart 
                  size={18} 
                  className={isLiked ? "text-red-500 fill-red-500" : "text-gray-500"} 
                />
                <span className="ml-1 text-sm">{comment.likes || 0}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-auto p-0"
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              >
                <CornerDownLeft size={18} className="mr-1" />
                Responder
              </Button>
              
              {isCurrentUserAuthor && !editingComment && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-auto p-0"
                    onClick={() => comment.id && handleEditComment(comment.id)}
                  >
                    <Edit size={18} className="mr-1" />
                    Editar
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-auto p-0 text-red-500"
                    onClick={() => comment.id && confirmDeleteComment(comment.id)}
                  >
                    <Trash2 size={18} className="mr-1" />
                    Excluir
                  </Button>
                </>
              )}
            </div>
            
            {replyingTo === comment.id && (
              <div className="mt-3">
                <Textarea
                  placeholder="Escreva uma resposta..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="resize-none text-sm mb-2"
                  rows={2}
                  disabled={isReplyingToComment}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyingTo(null)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => comment.id && handleReply(comment.id)}
                    disabled={!replyText.trim() || isReplyingToComment}
                  >
                    {isReplyingToComment ? "Enviando..." : "Responder"}
                  </Button>
                </div>
              </div>
            )}
            
            {/* Render replies recursively */}
            {replies.length > 0 && (
              <div className="mt-3 space-y-3">
                {replies.map(reply => renderComment(reply, level + 1))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold mb-6">Comentários</h3>
      
      <div className="mb-6">
        <Textarea
          placeholder={currentUser ? "Adicione um comentário..." : "Entre para comentar"}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          disabled={!currentUser || isAddingComment}
          className="mb-3 resize-none"
          rows={3}
        />
        <div className="flex justify-end">
          <Button 
            onClick={handleComment} 
            disabled={!currentUser || !commentText.trim() || isAddingComment}
          >
            {!currentUser ? "Entre para comentar" : isAddingComment ? "Enviando..." : "Comentar"}
          </Button>
        </div>
      </div>
      
      <div className="space-y-6">
        {rootComments.length === 0 ? (
          <p className="text-center text-gray-500 py-6">
            Seja o primeiro a comentar neste artigo!
          </p>
        ) : (
          rootComments.map(comment => renderComment(comment))
        )}
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir comentário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este comentário? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteComment}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeletingComment ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CommentSection;
