
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Heart } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  likes: number;
  liked?: boolean;
  createdAt: string;
  replies?: Comment[];
}

interface CommentSectionProps {
  newsId: string;
  comments: Comment[];
  currentUser?: {
    id: string;
    name: string;
    avatar?: string;
  } | null;
  onLogin: () => void;
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
  const { toast } = useToast();

  const handleComment = () => {
    if (!currentUser) {
      onLogin();
      return;
    }
    
    if (!commentText.trim()) {
      toast({
        title: "Comment cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would call an API
    toast({
      title: "Comment submitted",
      description: "Your comment has been submitted and will appear soon.",
    });
    
    setCommentText("");
  };

  const handleReply = (commentId: string) => {
    if (!currentUser) {
      onLogin();
      return;
    }
    
    if (!replyText.trim()) {
      toast({
        title: "Reply cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would call an API
    toast({
      title: "Reply submitted",
      description: "Your reply has been submitted and will appear soon.",
    });
    
    setReplyingTo(null);
    setReplyText("");
  };

  const handleLike = (commentId: string, isLiked: boolean) => {
    if (!currentUser) {
      onLogin();
      return;
    }
    
    // In a real app, this would call an API
    toast({
      description: isLiked 
        ? "You unliked this comment" 
        : "You liked this comment",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold mb-6">Comments</h3>
      
      <div className="mb-6">
        <Textarea
          placeholder={currentUser ? "Add a comment..." : "Sign in to comment"}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          disabled={!currentUser}
          className="mb-3 resize-none"
          rows={3}
        />
        <div className="flex justify-end">
          <Button 
            onClick={handleComment} 
            disabled={!currentUser || !commentText.trim()}
          >
            {currentUser ? "Comment" : "Sign In to Comment"}
          </Button>
        </div>
      </div>
      
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-center text-gray-500 py-6">
            Be the first to comment on this article!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src={comment.author.avatar} />
                  <AvatarFallback>{getInitials(comment.author.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{comment.author.name}</span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-auto"
                      onClick={() => handleLike(comment.id, !!comment.liked)}
                    >
                      <Heart 
                        size={18} 
                        className={comment.liked ? "fill-red-500 text-red-500" : "text-gray-500"} 
                      />
                      <span className="ml-1 text-sm">{comment.likes}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-auto p-0"
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    >
                      Reply
                    </Button>
                  </div>
                  
                  {replyingTo === comment.id && (
                    <div className="mt-3">
                      <Textarea
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="resize-none text-sm mb-2"
                        rows={2}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReplyingTo(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleReply(comment.id)}
                          disabled={!replyText.trim()}
                        >
                          Reply
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-200">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start gap-3">
                          <Avatar className="w-7 h-7">
                            <AvatarImage src={reply.author.avatar} />
                            <AvatarFallback>{getInitials(reply.author.name)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-sm">{reply.author.name}</span>
                              <span className="text-xs text-gray-500">
                                {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{reply.content}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-0 h-auto"
                                onClick={() => handleLike(reply.id, !!reply.liked)}
                              >
                                <Heart 
                                  size={16} 
                                  className={reply.liked ? "fill-red-500 text-red-500" : "text-gray-500"} 
                                />
                                <span className="ml-1 text-xs">{reply.likes}</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
