
import { useState, useEffect } from "react";
import { 
  Edit,
  Trash2,
  PlusCircle,
  CheckCircle,
  XCircle,
  Search,
  Loader2
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  Category
} from "@/services/categoryService";

interface CategoryWithCount extends Category {
  count?: number;
  active?: boolean;
}

const CategoryManagement = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithCount | null>(null);
  const [newCategory, setNewCategory] = useState({ name: "", slug: "", description: "", active: true });
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch categories
  const { data: categoriesData = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
  
  // Fetch articles to count by category
  const { data: articlesData = [] } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const response = await fetch('/articles');
      return response.json();
    },
    meta: {
      onError: () => {
        console.error("Failed to fetch articles for category counts");
      }
    }
  });
  
  // Enrich categories with article counts
  const categories: CategoryWithCount[] = categoriesData.map((category: Category) => {
    const count = articlesData.filter((article: any) => article.category === category.id).length;
    return {
      ...category,
      count,
      active: true // Assumimos todas as categorias como ativas por padrão
    };
  });
  
  // Create mutation
  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsAddDialogOpen(false);
      setNewCategory({ name: "", slug: "", description: "", active: true });
      toast.success(`Categoria "${newCategory.name}" foi criada.`);
    },
    onError: (error) => {
      toast.error(`Erro ao criar categoria: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  });
  
  // Update mutation
  const updateMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsEditDialogOpen(false);
      toast.success(`Categoria "${newCategory.name}" foi atualizada.`);
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar categoria: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  });
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsDeleteDialogOpen(false);
      if (selectedCategory) {
        toast.success(`Categoria "${selectedCategory.name}" foi excluída.`);
      }
    },
    onError: (error) => {
      toast.error(`Erro ao excluir categoria: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  });
  
  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };
  
  const handleNameChange = (value: string) => {
    setNewCategory({
      ...newCategory,
      name: value,
      slug: generateSlug(value)
    });
  };
  
  const handleSlugChange = (value: string) => {
    setNewCategory({
      ...newCategory,
      slug: generateSlug(value)
    });
  };
  
  const handleActiveChange = (checked: boolean) => {
    setNewCategory({
      ...newCategory,
      active: checked
    });
  };
  
  const handleAddCategory = () => {
    if (!newCategory.name) {
      toast.error("Nome da categoria é obrigatório");
      return;
    }
    
    createMutation.mutate({
      name: newCategory.name,
      slug: newCategory.slug || generateSlug(newCategory.name),
      description: newCategory.description
    });
  };
  
  const openEditDialog = (category: CategoryWithCount) => {
    setSelectedCategory(category);
    setNewCategory({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      active: category.active !== false
    });
    setIsEditDialogOpen(true);
  };
  
  const handleUpdateCategory = () => {
    if (!selectedCategory?.id) return;
    
    updateMutation.mutate({
      id: selectedCategory.id,
      name: newCategory.name,
      slug: newCategory.slug,
      description: newCategory.description
    });
  };
  
  const openDeleteDialog = (category: CategoryWithCount) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteCategory = () => {
    if (!selectedCategory?.id) return;
    deleteMutation.mutate(selectedCategory.id);
  };

  // Filter categories by search query
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout activeTab="categories">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Category Management</h1>
            <p className="text-gray-500 mt-1">Organize your content with categories</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2 shadow-sm">
            <PlusCircle className="h-5 w-5" />
            Add Category
          </Button>
        </div>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle>Categories</CardTitle>
            <CardDescription>
              Manage categories for news articles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search categories..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Articles</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex justify-center items-center">
                          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                          <span className="ml-2">Loading categories...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No categories found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCategories.map((category) => (
                      <TableRow key={category.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.slug}</TableCell>
                        <TableCell>{category.count || 0}</TableCell>
                        <TableCell>
                          <Badge variant={category.active !== false ? "default" : "outline"} className={category.active !== false ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}>
                            {category.active !== false ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(category)} className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(category)} className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        {/* Add Category Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={newCategory.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Enter category name"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={newCategory.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="url-slug"
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  This will be used in the URL: example.com/category/{newCategory.slug || 'url-slug'}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  placeholder="Brief description of this category"
                  className="w-full"
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="active"
                  checked={newCategory.active}
                  onCheckedChange={handleActiveChange}
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={createMutation.isPending}>Cancel</Button>
              <Button onClick={handleAddCategory} disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Category"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Category Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Category Name</Label>
                <Input
                  id="edit-name"
                  value={newCategory.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Enter category name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-slug">URL Slug</Label>
                <Input
                  id="edit-slug"
                  value={newCategory.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="url-slug"
                />
                <p className="text-sm text-muted-foreground">
                  This will be used in the URL: example.com/category/{newCategory.slug || 'url-slug'}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description (Optional)</Label>
                <Input
                  id="edit-description"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  placeholder="Brief description of this category"
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="edit-active"
                  checked={newCategory.active}
                  onCheckedChange={handleActiveChange}
                />
                <Label htmlFor="edit-active">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={updateMutation.isPending}>Cancel</Button>
              <Button onClick={handleUpdateCategory} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Category"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Delete Category Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Category</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="mb-2">
                Are you sure you want to delete category "{selectedCategory?.name}"? This action cannot be undone.
              </p>
              {selectedCategory && selectedCategory.count && selectedCategory.count > 0 && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 text-amber-800 rounded-md">
                  <XCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    Warning: This category contains {selectedCategory.count} articles which will be uncategorized.
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={deleteMutation.isPending}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteCategory} disabled={deleteMutation.isPending}>
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Category"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default CategoryManagement;
