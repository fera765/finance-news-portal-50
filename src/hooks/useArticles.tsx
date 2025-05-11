
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Article, 
  getArticles, 
  getArticleById, 
  createArticle, 
  updateArticle, 
  deleteArticle 
} from "@/services/articleService";
import { toast } from "sonner";

export function useArticles() {
  const queryClient = useQueryClient();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  // Fetch all articles
  const { 
    data: articles = [],
    isLoading,
    isError
  } = useQuery({
    queryKey: ['articles'],
    queryFn: () => getArticles(),
  });
  
  // Create article mutation
  const createArticleMutation = useMutation({
    mutationFn: createArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast.success('Article created successfully');
      setIsEditorOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to create article');
      console.error('Error creating article:', error);
    }
  });
  
  // Update article mutation
  const updateArticleMutation = useMutation({
    mutationFn: updateArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast.success('Article updated successfully');
      setIsEditorOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to update article');
      console.error('Error updating article:', error);
    }
  });
  
  // Delete article mutation
  const deleteArticleMutation = useMutation({
    mutationFn: (id: string) => deleteArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast.success('Article deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete article');
      console.error('Error deleting article:', error);
    }
  });
  
  // Open editor for new article
  const openNewArticleEditor = () => {
    setSelectedArticle(null);
    setIsEditorOpen(true);
  };
  
  // Open editor for existing article
  const openEditArticleEditor = (article: Article) => {
    setSelectedArticle(article);
    setIsEditorOpen(true);
  };
  
  // Close editor
  const closeEditor = () => {
    setIsEditorOpen(false);
    setSelectedArticle(null);
  };
  
  // Handle article save
  const handleSaveArticle = (article: Article) => {
    if (article.id) {
      updateArticleMutation.mutate(article);
    } else {
      createArticleMutation.mutate(article);
    }
  };
  
  // Handle article delete
  const handleDeleteArticle = (article: Article) => {
    if (article.id) {
      deleteArticleMutation.mutate(article.id);
    }
  };
  
  return {
    articles,
    isLoading,
    isError,
    selectedArticle,
    isEditorOpen,
    openNewArticleEditor,
    openEditArticleEditor,
    closeEditor,
    handleSaveArticle,
    handleDeleteArticle,
  };
}
