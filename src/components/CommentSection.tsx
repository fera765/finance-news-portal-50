
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useComments } from "@/hooks/useComments";
import { Comment, likeComment, isCommentLiked } from "@/services/commentService";
import { User } from "@/components/Layout";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/services/api";

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
  const [replyText, setReplyText] = useState("");
  const [commentAuthors, setCommentAuthors] = useState<Record<string, CommentAuthor>>({});
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  
  // Use our comments hook
  const { addComment, replyToComment, isAddingComment, isReplyingToComment } = useComments(newsId);

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
      toast({
        title: "O comentário não pode estar vazio",
        variant: "destructive",
      });
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
      toast({
        title: "A resposta não pode estar vazia",
        variant: "destructive",
      });
      return;
    }
    
    // Add the reply using our hook
    replyToComment({ commentId, content: replyText });
    setReplyingTo(null);
    setReplyText("");
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
      
      toast({
        description: isLiked 
          ? "Você curtiu este comentário" 
          : "Você descurtiu este comentário",
      });
    } catch (error) {
      console.error("Error liking comment:", error);
      toast({
        title: "Erro",
        description: "Não foi possível processar sua solicitação",
        variant: "destructive"
      });
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
        {comments.length === 0 ? (
          <p className="text-center text-gray-500 py-6">
            Seja o primeiro a comentar neste artigo!
          </p>
        ) : (
          comments.map((comment) => {
            const author = getAuthorInfo(comment.userId);
            const isLiked = likedComments[comment.id || ''] || false;
            
            return (
              <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
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
                    <p className="text-gray-700">{comment.content}</p>
                    <div className="flex items-center gap-4 mt-2">
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
                        Responder
                      </Button>
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
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommentSection;
