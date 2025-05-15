import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Edit, Trash, Plus, Calendar, FileText } from "lucide-react";
import { Article } from "@/services/articleService";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface ArticleListProps {
  articles: Article[];
  isLoading: boolean;
  onEdit: (article: Article) => void;
  onDelete: (article: Article) => void;
  onView: (article: Article) => void;
  onAdd: () => void;
}

export function ArticleList({
  articles,
  isLoading,
  onEdit,
  onDelete,
  onView,
  onAdd
}: ArticleListProps) {
  const { toast } = useToast();
  const [sortBy, setSortBy] = useState<keyof Article>("publishDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Sort articles based on current sort settings
  const sortedArticles = [...articles].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (!aValue && !bValue) return 0;
    if (!aValue) return sortOrder === "asc" ? -1 : 1;
    if (!bValue) return sortOrder === "asc" ? 1 : -1;
    
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc" 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    // Fallback for other types
    return 0;
  });

  // Handle sort toggle
  const handleSort = (column: keyof Article) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // Handle delete confirmation
  const handleDeleteClick = (article: Article) => {
    if (confirm(`Are you sure you want to delete "${article.title}"?`)) {
      onDelete(article);
      toast(`"${article.title}" has been deleted`);
    }
  };

  // Format date helper
  const formatDate = (date?: Date | string) => {
    if (!date) return "—";
    return format(new Date(date), "PPP");
  };

  // Get status badge class
  const getStatusClass = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Articles</h2>
        <Button onClick={onAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          New Article
        </Button>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableCaption>Manage your articles</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("title")}
              >
                Title {sortBy === "title" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("status")}
              >
                Status {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("category")}
              >
                Category {sortBy === "category" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("publishDate")}
              >
                Date {sortBy === "publishDate" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">Loading articles...</TableCell>
              </TableRow>
            ) : sortedArticles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">No articles found</TableCell>
              </TableRow>
            ) : (
              sortedArticles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>{article.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs uppercase font-medium ${getStatusClass(article.status)}`}>
                      {article.status}
                    </span>
                  </TableCell>
                  <TableCell>{article.category}</TableCell>
                  <TableCell>
                    {article.status === "scheduled" ? (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDate(article.publishDate)}
                      </div>
                    ) : article.publishDate ? (
                      formatDate(article.publishDate)
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onView(article)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onEdit(article)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteClick(article)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
