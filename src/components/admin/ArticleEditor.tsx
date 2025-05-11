
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
    status: 'draft'
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
        status: 'draft'
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
    setPreviewUrl(`/preview/${formData.slug}`);
    
    // Simulate opening a preview window
    setTimeout(() => {
      setPreviewUrl(null);
    }, 3000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto sm:max-w-[95vw] md:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Artigo' : 'Criar Novo Artigo'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-6 py-4">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Título do artigo"
            />
          </div>
          
          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="artigo-url-slug"
            />
            <p className="text-sm text-muted-foreground">
              Será usado na URL: example.com/news/{formData.slug || 'artigo-slug'}
            </p>
          </div>
          
          {/* Categoria & Autor em uma linha para telas maiores, em coluna para telas menores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
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
              <Label htmlFor="author">Autor</Label>
              <Select
                value={formData.author}
                onValueChange={(value) => handleInputChange('author', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o autor" />
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
          
          {/* Editor de texto rico */}
          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo</Label>
            <RichTextEditor
              value={formData.content}
              onChange={(value) => handleInputChange('content', value)}
              placeholder="Escreva o conteúdo do artigo aqui..."
            />
          </div>
          
          {/* Agendar Publicação */}
          <div className="space-y-2">
            <Label>Agendar Publicação</Label>
            <div className="flex flex-col sm:flex-row gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-[240px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {publishDate ? format(publishDate, "PPP") : "Escolha uma data"}
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
              <p>URL de Preview: {previewUrl}</p>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row justify-between gap-2">
          <Button variant="outline" onClick={onClose} className="sm:order-1 w-full sm:w-auto">
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={handleSaveDraft} className="w-full sm:w-auto">
              <Save className="mr-2 h-4 w-4" />
              Salvar Rascunho
            </Button>
            <Button variant="outline" onClick={handlePreview} className="w-full sm:w-auto">
              <ExternalLink className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button variant="outline" onClick={handleSchedule} disabled={!publishDate} className="w-full sm:w-auto">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Agendar
            </Button>
            <Button onClick={handlePublish} className="w-full sm:w-auto">
              <Upload className="mr-2 h-4 w-4" />
              Publicar Agora
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleEditor;
