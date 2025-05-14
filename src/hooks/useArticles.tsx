
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
import { useNavigate } from "react-router-dom";

export function useArticles() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  // Fetch all articles
  const { 
    data: articles = [],
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['articles'],
    queryFn: () => getArticles(),
  });
  
  // Create article mutation
  const createArticleMutation = useMutation({
    mutationFn: createArticle,
    onSuccess: (newArticle) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast.success('Artigo criado com sucesso');
      setIsEditorOpen(false);
      
      // Navigate to the new article page
      navigate(`/news/${newArticle.id}/${newArticle.slug}`);
    },
    onError: (error) => {
      toast.error('Falha ao criar artigo');
      console.error('Error creating article:', error);
    }
  });
  
  // Update article mutation
  const updateArticleMutation = useMutation({
    mutationFn: updateArticle,
    onSuccess: (updatedArticle) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['article', updatedArticle.id] });
      queryClient.invalidateQueries({ queryKey: ['article', 'slug', updatedArticle.slug] });
      
      toast.success('Artigo atualizado com sucesso');
      setIsEditorOpen(false);
    },
    onError: (error) => {
      toast.error('Falha ao atualizar artigo');
      console.error('Error updating article:', error);
    }
  });
  
  // Delete article mutation
  const deleteArticleMutation = useMutation({
    mutationFn: (id: string) => deleteArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast.success('Artigo excluído com sucesso');
    },
    onError: (error) => {
      toast.error('Falha ao excluir artigo');
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
      if (window.confirm(`Tem certeza que deseja excluir o artigo "${article.title}"?`)) {
        deleteArticleMutation.mutate(article.id);
      }
    }
  };
  
  return {
    articles,
    isLoading,
    isError,
    refetch,
    selectedArticle,
    isEditorOpen,
    openNewArticleEditor,
    openEditArticleEditor,
    closeEditor,
    handleSaveArticle,
    handleDeleteArticle,
    isCreating: createArticleMutation.isPending,
    isUpdating: updateArticleMutation.isPending,
    isDeleting: deleteArticleMutation.isPending
  };
}
