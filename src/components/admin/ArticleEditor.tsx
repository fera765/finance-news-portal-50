
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
import { Switch } from "@/components/ui/switch";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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
    isDetach: false
  });
  
  const [publishDate, setPublishDate] = useState<Date | undefined>(
    article?.publishDate 
      ? (typeof article.publishDate === 'string' 
          ? new Date(article.publishDate) 
          : article.publishDate)
      : undefined
  );

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  
  useEffect(() => {
    if (article) {
      setFormData({
        ...article,
        isDetach: article.isDetach || false
      });
      setPublishDate(
        article.publishDate 
          ? (typeof article.publishDate === 'string' 
              ? new Date(article.publishDate) 
              : article.publishDate)
          : undefined
      );
      setValidationErrors([]);
      setShowValidationAlert(false);
    } else {
      setFormData({
        title: "",
        slug: "",
        content: "",
        category: "",
        author: "",
        status: 'draft',
        isDetach: false
      });
      setPublishDate(undefined);
      setValidationErrors([]);
      setShowValidationAlert(false);
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
  
  const validateArticle = (status: 'draft' | 'published' | 'scheduled'): boolean => {
    const errors: string[] = [];
    
    // Apenas validar campos obrigatórios se o artigo não for rascunho
    if (status !== 'draft') {
      if (!formData.title || formData.title.trim() === '') {
        errors.push('Título é obrigatório');
      }
      
      if (!formData.slug || formData.slug.trim() === '') {
        errors.push('Slug é obrigatório');
      }
      
      if (!formData.content || formData.content.trim() === '') {
        errors.push('Conteúdo é obrigatório');
      }
      
      if (!formData.category || formData.category.trim() === '') {
        errors.push('Categoria é obrigatória');
      }
      
      if (!formData.author || formData.author.trim() === '') {
        errors.push('Autor é obrigatório');
      }
      
      if (status === 'scheduled' && !publishDate) {
        errors.push('Data de publicação é obrigatória para artigos agendados');
      }
    }
    
    setValidationErrors(errors);
    setShowValidationAlert(errors.length > 0);
    
    return errors.length === 0;
  };
  
  const handleSaveDraft = () => {
    onSave({
      ...formData,
      status: 'draft'
    });
  };
  
  const handlePublish = () => {
    if (validateArticle('published')) {
      onSave({
        ...formData,
        status: 'published',
        publishDate: new Date()
      });
    }
  };
  
  const handleSchedule = () => {
    if (!publishDate) {
      validateArticle('scheduled');
      return;
    }
    
    if (validateArticle('scheduled')) {
      onSave({
        ...formData,
        status: 'scheduled',
        publishDate
      });
    }
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
        
        {showValidationAlert && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Erro de Validação</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 mt-2">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 gap-6 py-4">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Título do artigo"
              className={validationErrors.includes('Título é obrigatório') ? "border-red-500" : ""}
            />
          </div>
          
          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="artigo-url-slug"
              className={validationErrors.includes('Slug é obrigatório') ? "border-red-500" : ""}
            />
            <p className="text-sm text-muted-foreground">
              Será usado na URL: example.com/news/{formData.slug || 'artigo-slug'}
            </p>
          </div>
          
          {/* isDetach Switch */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="isDetach" className="text-base">
                Exibir no Carrossel
                <p className="text-sm text-muted-foreground mt-1">
                  Se ativado, este artigo será exibido no carrossel da página inicial
                </p>
              </Label>
              <Switch
                id="isDetach"
                checked={formData.isDetach}
                onCheckedChange={(checked) => handleInputChange('isDetach', checked)}
              />
            </div>
          </div>
          
          {/* Categoria & Autor em uma linha para telas maiores, em coluna para telas menores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger className={validationErrors.includes('Categoria é obrigatória') ? "border-red-500" : ""}>
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
              <Label htmlFor="author">Autor *</Label>
              <Select
                value={formData.author}
                onValueChange={(value) => handleInputChange('author', value)}
              >
                <SelectTrigger className={validationErrors.includes('Autor é obrigatório') ? "border-red-500" : ""}>
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
            <Label htmlFor="content">Conteúdo *</Label>
            <RichTextEditor
              value={formData.content}
              onChange={(value) => handleInputChange('content', value)}
              placeholder="Escreva o conteúdo do artigo aqui..."
              className={validationErrors.includes('Conteúdo é obrigatório') ? "border-red-500" : ""}
            />
          </div>
          
          {/* Agendar Publicação */}
          <div className="space-y-2">
            <Label>Agendar Publicação {formData.status === 'scheduled' ? '*' : ''}</Label>
            <div className="flex flex-col sm:flex-row gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full sm:w-[240px] justify-start text-left font-normal ${
                      validationErrors.includes('Data de publicação é obrigatória para artigos agendados') 
                      ? "border-red-500" : ""
                    }`}
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
          
          <div className="text-sm text-muted-foreground">
            * Campos obrigatórios para publicação
          </div>
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
