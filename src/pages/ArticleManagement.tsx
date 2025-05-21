
import { useQuery } from "@tanstack/react-query";
import ArticleList from "@/components/admin/ArticleList";
import ArticleEditor from "@/components/admin/ArticleEditor";
import { useArticles } from "@/hooks/useArticles";
import { getCategories } from "@/services/categoryService";
import { getUsers } from "@/services/userService";
import AdminLayout from "@/components/admin/AdminLayout";
import { Article } from "@/services/articleService";
import { Button } from "@/components/ui/button";
import { PlusCircle, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useState } from "react";

const ArticleManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
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

  // Fetch authors
  const { data: authors = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers(),
  });

  // View article handler
  const handleViewArticle = (article: Article) => {
    // Abrindo em nova aba com o slug correto
    window.open(`/news/${article.slug}`, '_blank');
  };

  // Filter articles based on search query and filters
  const filteredArticles = articles.map(article => {
    // Enriquecer artigos com informações de categoria e autor para exibição
    const category = categories.find(cat => cat.id === article.category);
    const categoryName = category ? category.name : 'Sem categoria';
    
    return {
      ...article,
      categoryName // Adicionar nome da categoria para exibição
    };
  }).filter(article => {
    // Search filter
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryFilter === "all" || article.category === categoryFilter;
    
    // Status filter
    const matchesStatus = statusFilter === "all" || article.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <AdminLayout activeTab="articles">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Article Management</h1>
            <p className="text-gray-500 mt-1">Manage and publish your content</p>
          </div>
          <Button onClick={openNewArticleEditor} className="gap-2 shadow-sm">
            <PlusCircle className="h-5 w-5" />
            New Article
          </Button>
        </div>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle>Articles</CardTitle>
            <CardDescription>Manage your published and draft articles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Search articles..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-3">
                <div className="w-40">
                  <Select 
                    value={categoryFilter} 
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-36">
                  <Select 
                    value={statusFilter} 
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <ArticleList
              articles={filteredArticles}
              isLoading={isLoading}
              onAdd={openNewArticleEditor}
              onEdit={openEditArticleEditor}
              onDelete={handleDeleteArticle}
              onView={handleViewArticle}
            />
          </CardContent>
        </Card>
        
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
