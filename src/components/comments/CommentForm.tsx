
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/components/Layout";

interface CommentFormProps {
  onSubmit: (content: string) => void;
  isSubmitting: boolean;
  currentUser?: User | null;
  onLogin: () => void;
  placeholder?: string;
}

export const CommentForm = ({
  onSubmit,
  isSubmitting,
  currentUser,
  onLogin,
  placeholder = "Adicione um comentário..."
}: CommentFormProps) => {
  const [commentText, setCommentText] = useState("");

  const handleSubmit = () => {
    if (!currentUser) {
      onLogin();
      return;
    }
    
    if (!commentText.trim()) return;
    
    onSubmit(commentText);
    setCommentText("");
  };

  return (
    <div className="mb-6">
      <Textarea
        placeholder={currentUser ? placeholder : "Entre para comentar"}
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        disabled={!currentUser || isSubmitting}
        className="mb-3 resize-none"
        rows={3}
      />
      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit} 
          disabled={!currentUser || !commentText.trim() || isSubmitting}
        >
          {!currentUser ? "Entre para comentar" : isSubmitting ? "Enviando..." : "Comentar"}
        </Button>
      </div>
    </div>
  );
};
