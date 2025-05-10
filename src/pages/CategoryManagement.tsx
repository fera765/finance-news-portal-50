
import { useState } from "react";
import { 
  Edit,
  Trash2,
  PlusCircle,
  CheckCircle,
  XCircle
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
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
  active: boolean;
}

// Mock data for categories
const mockCategories: Category[] = [
  {
    id: "1",
    name: "Economy",
    slug: "economy",
    count: 15,
    active: true
  },
  {
    id: "2",
    name: "Markets",
    slug: "markets",
    count: 12,
    active: true
  },
  {
    id: "3",
    name: "Business",
    slug: "business",
    count: 8,
    active: true
  },
  {
    id: "4",
    name: "Cryptocurrency",
    slug: "cryptocurrency",
    count: 6,
    active: true
  },
  {
    id: "5",
    name: "Real Estate",
    slug: "real-estate",
    count: 4,
    active: false
  }
];

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({ name: "", slug: "", active: true });
  
  const { toast } = useToast();
  
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
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive"
      });
      return;
    }
    
    const newId = (categories.length + 1).toString();
    
    setCategories([
      ...categories,
      {
        id: newId,
        name: newCategory.name,
        slug: newCategory.slug || generateSlug(newCategory.name),
        count: 0,
        active: newCategory.active
      }
    ]);
    
    setIsAddDialogOpen(false);
    setNewCategory({ name: "", slug: "", active: true });
    
    toast({
      title: "Category Added",
      description: `Category "${newCategory.name}" has been created.`
    });
  };
  
  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setNewCategory({
      name: category.name,
      slug: category.slug,
      active: category.active
    });
    setIsEditDialogOpen(true);
  };
  
  const handleUpdateCategory = () => {
    if (!selectedCategory) return;
    
    setCategories(categories.map(cat => 
      cat.id === selectedCategory.id 
        ? { 
            ...cat, 
            name: newCategory.name, 
            slug: newCategory.slug,
            active: newCategory.active
          } 
        : cat
    ));
    
    setIsEditDialogOpen(false);
    setNewCategory({ name: "", slug: "", active: true });
    
    toast({
      title: "Category Updated",
      description: `Category "${newCategory.name}" has been updated.`
    });
  };
  
  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteCategory = () => {
    if (!selectedCategory) return;
    
    setCategories(categories.filter(cat => cat.id !== selectedCategory.id));
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Category Deleted",
      description: `Category "${selectedCategory.name}" has been deleted.`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Category Management</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Category
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>
            Manage categories for news articles.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell>{category.count}</TableCell>
                  <TableCell>
                    <Badge variant={category.active ? "default" : "outline"}>
                      {category.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(category)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(category)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={newCategory.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="url-slug"
              />
              <p className="text-sm text-muted-foreground">
                This will be used in the URL: example.com/category/{newCategory.slug || 'url-slug'}
              </p>
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
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCategory}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
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
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateCategory}>Update Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Category Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete category "{selectedCategory?.name}"? This action cannot be undone.
            </p>
            {selectedCategory && selectedCategory.count > 0 && (
              <p className="text-red-500 mt-2">
                Warning: This category contains {selectedCategory.count} articles which will be uncategorized.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>Delete Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryManagement;
