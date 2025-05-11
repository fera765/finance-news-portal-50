
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArticleList } from "@/components/admin/ArticleList";
import ArticleEditor from "@/components/admin/ArticleEditor";
import { useArticles } from "@/hooks/useArticles";
import { getCategories } from "@/services/categoryService";
import AdminLayout from "@/components/admin/AdminLayout";
import { Article } from "@/services/articleService";

const ArticleManagement = () => {
  const {
    articles,
    isLoading,
    isEditorOpen,
    selectedArticle,
    openNewArticleEditor,
    openEditArticleEditor,
    closeEditor,
    handleSaveArticle,
    handleDeleteArticle,
  } = useArticles();

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  });

  // Mock authors data (in a real app, you would fetch this)
  const authors = [
    { id: "1", name: "John Doe", role: "Editor" },
    { id: "2", name: "Jane Smith", role: "Admin" },
    { id: "3", name: "Bob Johnson", role: "Editor" },
  ];

  // View article handler
  const handleViewArticle = (article: Article) => {
    window.open(`/news/${article.slug}`, '_blank');
  };

  return (
    <AdminLayout activeTab="articles">
      <div className="container mx-auto py-6 space-y-6">
        <h1 className="text-3xl font-bold">Article Management</h1>
        
        <ArticleList
          articles={articles}
          isLoading={isLoading}
          onAdd={openNewArticleEditor}
          onEdit={openEditArticleEditor}
          onDelete={handleDeleteArticle}
          onView={handleViewArticle}
        />
        
        <ArticleEditor
          isOpen={isEditorOpen}
          onClose={closeEditor}
          onSave={handleSaveArticle}
          article={selectedArticle || undefined}
          categories={categories}
          authors={authors}
        />
      </div>
    </AdminLayout>
  );
};

export default ArticleManagement;
