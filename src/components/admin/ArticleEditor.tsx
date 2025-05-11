import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Save, Upload, ExternalLink, X } from "lucide-react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Article } from "@/services/articleService";

interface Category {
  id: string;
  name: string;
}

interface Author {
  id: string;
  name: string;
  role: string;
}

interface ArticleEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (article: Article) => void;
  article?: Article;
  categories: Category[];
  authors: Author[];
}

const ArticleEditor = ({
  isOpen,
  onClose,
  onSave,
  article,
  categories,
  authors
}: ArticleEditorProps) => {
  const isEditing = !!article?.id;
  
  const [formData, setFormData] = useState<Article>(article || {
    title: "",
    slug: "",
    content: "",
    category: "",
    author: "",
    status: 'draft',
    summary: "",
    tags: []
  });
  
  const [publishDate, setPublishDate] = useState<Date | undefined>(
    article?.publishDate 
      ? (typeof article.publishDate === 'string' 
          ? new Date(article.publishDate) 
          : article.publishDate)
      : undefined
  );

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  useEffect(() => {
    if (article) {
      setFormData(article);
      setPublishDate(
        article.publishDate 
          ? (typeof article.publishDate === 'string' 
              ? new Date(article.publishDate) 
              : article.publishDate)
          : undefined
      );
    } else {
      setFormData({
        title: "",
        slug: "",
        content: "",
        category: "",
        author: "",
        status: 'draft',
        summary: "",
        tags: []
      });
      setPublishDate(undefined);
    }
  }, [article, isOpen]);
  
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };
  
  const handleTitleChange = (value: string) => {
    setFormData({
      ...formData,
      title: value,
      slug: generateSlug(value)
    });
  };
  
  const handleSlugChange = (value: string) => {
    setFormData({
      ...formData,
      slug: generateSlug(value)
    });
  };
  
  const handleInputChange = (field: keyof Article, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(Boolean);
    setFormData({
      ...formData,
      tags
    });
  };
  
  const handleSaveDraft = () => {
    onSave({
      ...formData,
      status: 'draft'
    });
  };
  
  const handlePublish = () => {
    onSave({
      ...formData,
      status: 'published',
      publishDate: new Date()
    });
  };
  
  const handleSchedule = () => {
    if (!publishDate) {
      return;
    }
    
    onSave({
      ...formData,
      status: 'scheduled',
      publishDate
    });
  };

  const handlePreview = () => {
    // In a real app, this would open a preview in a new tab or modal
    // For now, we'll just set a flag to show a message
    setPreviewUrl(`/preview/${formData.slug}`);
    
    // Simulate opening a preview window
    setTimeout(() => {
      setPreviewUrl(null);
    }, 3000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Article' : 'Create New Article'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Article title"
            />
          </div>
          
          {/* Category & Author */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Select
                value={formData.author}
                onValueChange={(value) => handleInputChange('author', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select author" />
                </SelectTrigger>
                <SelectContent>
                  {authors.map((author) => (
                    <SelectItem key={author.id} value={author.id}>
                      {author.name} ({author.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="article-url-slug"
            />
            <p className="text-sm text-muted-foreground">
              This will be used in the URL: example.com/news/{formData.slug || 'article-slug'}
            </p>
          </div>
          
          {/* Summary */}
          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Input
              id="summary"
              value={formData.summary || ''}
              onChange={(e) => handleInputChange('summary', e.target.value)}
              placeholder="Brief summary of the article"
            />
          </div>
          
          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Featured Image URL</Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl || ''}
              onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={formData.tags?.join(', ') || ''}
              onChange={(e) => handleTagsChange(e.target.value)}
              placeholder="economy, finance, markets"
            />
          </div>
          
          {/* Content with Rich Text Editor */}
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <RichTextEditor
              value={formData.content}
              onChange={(value) => handleInputChange('content', value)}
              placeholder="Write your article content here..."
            />
            <p className="text-xs text-muted-foreground">
              Supports Markdown formatting. Use # for headings, * for italic, ** for bold, etc.
            </p>
          </div>
          
          {/* Schedule Publication */}
          <div className="space-y-2">
            <Label>Schedule Publication</Label>
            <div className="flex flex-col sm:flex-row gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-[240px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {publishDate ? format(publishDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={publishDate}
                    onSelect={setPublishDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {previewUrl && (
            <div className="p-3 bg-muted rounded-md">
              <p>Preview URL: {previewUrl}</p>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="mr-2 h-4 w-4" />
              Save as Draft
            </Button>
            <Button variant="outline" onClick={handlePreview}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button variant="outline" onClick={handleSchedule} disabled={!publishDate}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              Schedule
            </Button>
            <Button onClick={handlePublish}>
              <Upload className="mr-2 h-4 w-4" />
              Publish Now
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleEditor;
