
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useComments } from "@/hooks/useComments";
import { Comment } from "@/services/commentService";
import { User } from "@/components/Layout";
import { useToast } from "@/components/ui/use-toast";

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
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const { toast } = useToast();
  
  // Use our comments hook
  const { addComment, isAddingComment } = useComments(newsId);

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
        title: "Reply cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app with reply support, you would call the API here
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
    
    // In a real app, you would call the API to like/unlike comments
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

  const formatCommentAuthor = (userId: string) => {
    // This would typically be fetched from a users service
    // For now we'll just return a placeholder
    return {
      id: userId,
      name: `User ${userId.slice(0, 4)}`,
      avatar: `https://i.pravatar.cc/150?u=${userId}`
    };
  };

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold mb-6">Comments</h3>
      
      <div className="mb-6">
        <Textarea
          placeholder={currentUser ? "Add a comment..." : "Sign in to comment"}
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
            {!currentUser ? "Sign In to Comment" : isAddingComment ? "Posting..." : "Comment"}
          </Button>
        </div>
      </div>
      
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-center text-gray-500 py-6">
            Be the first to comment on this article!
          </p>
        ) : (
          comments.map((comment) => {
            const author = formatCommentAuthor(comment.userId);
            
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
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-auto"
                        onClick={() => handleLike(comment.id || '', false)}
                      >
                        <Heart size={18} className="text-gray-500" />
                        <span className="ml-1 text-sm">0</span>
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
                            onClick={() => handleReply(comment.id || '')}
                            disabled={!replyText.trim()}
                          >
                            Reply
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
