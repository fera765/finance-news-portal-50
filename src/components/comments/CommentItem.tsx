
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Edit, Trash2, CornerDownLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Comment } from "@/services/commentService";
import { User } from "@/components/Layout";

interface CommentItemProps {
  comment: Comment;
  level?: number;
  replies?: Comment[];
  currentUser?: User | null;
  isLiked: boolean;
  onLike: (commentId: string) => void;
  onReply: (commentId: string, content: string) => void;
  onEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  isUpdatingComment: boolean;
  isReplyingToComment: boolean;
}

export const CommentItem = ({
  comment,
  level = 0,
  replies = [],
  currentUser,
  isLiked,
  onLike,
  onReply,
  onEdit,
  onDelete,
  isUpdatingComment,
  isReplyingToComment
}: CommentItemProps) => {
  const [replyingTo, setReplyingTo] = useState<boolean>(false);
  const [editingComment, setEditingComment] = useState<boolean>(false);
  const [replyText, setReplyText] = useState("");
  const [editText, setEditText] = useState(comment.content);
  
  const isCurrentUserAuthor = currentUser && comment.userId === currentUser.id;
  const isReply = level > 0 || !!comment.parentId;
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;
    onReply(comment.id!, replyText);
    setReplyingTo(false);
    setReplyText("");
  };

  const handleEditSubmit = () => {
    if (!editText.trim()) return;
    onEdit(comment.id!, editText);
    setEditingComment(false);
  };

  return (
    <div key={comment.id} 
      className={`bg-gray-50 p-4 rounded-lg mb-3 ${level > 0 ? 'ml-6 border-l-2 border-gray-200' : ''}`}>
      <div className="flex items-start gap-3">
        <Avatar>
          <AvatarImage src={comment.userAvatar} />
          <AvatarFallback>{getInitials(comment.userName || 'Usuário')}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium">{comment.userName || `Usuário ${comment.userId.slice(0, 4)}`}</span>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(comment.createdAt), { 
                addSuffix: true,
                locale: ptBR
              })}
            </span>
          </div>
          
          {editingComment ? (
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
                  onClick={() => setEditingComment(false)}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleEditSubmit}
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
              onClick={() => onLike(comment.id!)}
            >
              <Heart 
                size={18} 
                className={isLiked ? "text-red-500 fill-red-500" : "text-gray-500"} 
              />
              <span className="ml-1 text-sm">{comment.likes || 0}</span>
            </Button>
            
            {/* Only show reply button for root comments (level 0) */}
            {level === 0 && !isReply && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-auto p-0"
                onClick={() => setReplyingTo(!replyingTo)}
                disabled={!currentUser}
              >
                <CornerDownLeft size={18} className="mr-1" />
                Responder
              </Button>
            )}
            
            {isCurrentUserAuthor && !editingComment && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-auto p-0"
                  onClick={() => {
                    setEditingComment(true);
                    setEditText(comment.content);
                  }}
                >
                  <Edit size={18} className="mr-1" />
                  Editar
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-auto p-0 text-red-500"
                  onClick={() => onDelete(comment.id!)}
                >
                  <Trash2 size={18} className="mr-1" />
                  Excluir
                </Button>
              </>
            )}
          </div>
          
          {replyingTo && !isReply && level === 0 && (
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
                  onClick={() => setReplyingTo(false)}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleReplySubmit}
                  disabled={!replyText.trim() || isReplyingToComment}
                >
                  {isReplyingToComment ? "Enviando..." : "Responder"}
                </Button>
              </div>
            </div>
          )}
          
          {/* Render replies */}
          {replies.length > 0 && (
            <div className="mt-3 space-y-3">
              {replies.map(reply => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  level={level + 1}
                  replies={[]} // No further nested replies
                  currentUser={currentUser}
                  isLiked={reply.id ? onLike !== undefined && currentUser ? isLiked : false}
                  onLike={onLike}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isUpdatingComment={isUpdatingComment}
                  isReplyingToComment={isReplyingToComment}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
