import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { getArticles, Article, deleteArticle } from '@/services/articleService';
import { getCategories, Category } from '@/services/categoryService';
import { getUsers, User } from '@/services/userService';
import { MoreHorizontal, Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ArticleListProps {
  articles?: Article[];
  isLoading?: boolean;
  onAdd?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (article: Article) => void;
}

// Make sure the component is properly exported as default
const ArticleList: React.FC<ArticleListProps> = ({ 
  articles: propArticles,
  isLoading: propIsLoading,
  onAdd,
  onEdit,
  onDelete,
  onView
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  // Use props if provided, otherwise fetch data
  const useLocalData = propArticles !== undefined;
  
  // Fetch articles, categories and users only if props are not provided
  const { data: fetchedArticles = [], isLoading: articlesLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: () => getArticles(),
    enabled: !useLocalData,
  });
  
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
  
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });
  
  // Use props data or fetched data
  const articles = useLocalData ? propArticles : fetchedArticles;
  const isLoading = useLocalData ? propIsLoading : articlesLoading;
  
  // Delete article mutation
  const deleteMutation = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast.success('Artigo excluído com sucesso');
    },
    onError: () => {
      toast.error('Erro ao excluir artigo');
    },
  });
  
  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este artigo?')) {
      if (onDelete) {
        onDelete(id);
      } else {
        deleteMutation.mutate(id);
      }
    }
  };
  
  const handleEdit = (id: string) => {
    if (onEdit) {
      onEdit(id);
    } else {
      navigate(`/admin/articles/edit/${id}`);
    }
  };
  
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat: Category) => cat.id === categoryId);
    return category?.name || 'Sem categoria';
  };
  
  const getAuthorName = (authorId: string) => {
    const user = users.find((u: User) => u.id === authorId);
    return user?.name || 'Autor desconhecido';
  };
  
  const filteredArticles = articles.filter((article: Article) => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getCategoryName(article.category).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gerenciamento de Artigos</CardTitle>
          <CardDescription>
            Gerencie todos os artigos do site.
          </CardDescription>
        </div>
        {onAdd ? (
          <Button onClick={onAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Artigo
          </Button>
        ) : (
          <Button onClick={() => navigate('/admin/articles/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Artigo
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar artigos..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {isLoading ? (
          <div>Carregando artigos...</div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-4">
            Nenhum artigo encontrado
          </div>
        ) : (
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.map((article: Article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">{article.title}</TableCell>
                    <TableCell>{getCategoryName(article.category)}</TableCell>
                    <TableCell>{getAuthorName(article.author)}</TableCell>
                    <TableCell>
                      <div className="capitalize">{article.status}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(article.id || '')}>
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(article.id || '')}
                          >
                            Excluir
                          </DropdownMenuItem>
                          {onView && (
                            <DropdownMenuItem onClick={() => onView(article)}>
                              Visualizar
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ArticleList;
