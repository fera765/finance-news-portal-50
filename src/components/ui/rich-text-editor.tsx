
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Bold, 
  Italic, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  List, 
  ListOrdered,
  Link2,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Eye,
  Edit as EditIcon,
  Code,
  Strikethrough,
  Underline
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DOMPurify from "dompurify";
import { marked } from "marked";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder, 
  className,
  minHeight = "300px"
}: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [renderedHtml, setRenderedHtml] = useState("");
  
  // Renderiza o HTML quando o valor muda ou a aba muda
  useEffect(() => {
    try {
      const rawHtml = marked.parse(value, { async: false }) as string;
      // Sanitize the HTML to prevent XSS attacks
      const sanitizedHtml = DOMPurify.sanitize(rawHtml);
      setRenderedHtml(sanitizedHtml);
    } catch (error) {
      console.error("Error parsing markdown content:", error);
      setRenderedHtml(value);
    }
  }, [value]);

  const insertFormatting = (startTag: string, endTag: string) => {
    // Obter o elemento textarea
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    // Se texto foi selecionado, envolva-o com as tags
    if (selectedText) {
      const newText = value.substring(0, start) + 
                    startTag + selectedText + endTag + 
                    value.substring(end);
      onChange(newText);
      
      // Restaurar a seleção após a atualização
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + startTag.length, 
          start + startTag.length + selectedText.length
        );
      }, 0);
    } else {
      // Se nenhum texto foi selecionado, apenas insira as tags com o cursor entre elas
      const newText = value.substring(0, start) + startTag + endTag + value.substring(end);
      onChange(newText);
      
      // Posicionar o cursor entre as tags
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + startTag.length, start + startTag.length);
      }, 0);
    }
  };

  const handleBold = () => insertFormatting("**", "**");
  const handleItalic = () => insertFormatting("*", "*");
  const handleUnderline = () => insertFormatting("<u>", "</u>");
  const handleStrikethrough = () => insertFormatting("~~", "~~");
  const handleCode = () => insertFormatting("`", "`");
  const handleAlignLeft = () => insertFormatting("\n<div style='text-align: left'>", "</div>\n");
  const handleAlignCenter = () => insertFormatting("\n<div style='text-align: center'>", "</div>\n");
  const handleAlignRight = () => insertFormatting("\n<div style='text-align: right'>", "</div>\n");
  const handleBulletList = () => insertFormatting("\n- ", "\n");
  const handleNumberedList = () => insertFormatting("\n1. ", "\n");
  const handleQuote = () => insertFormatting("\n> ", "\n");
  const handleH1 = () => insertFormatting("\n# ", "\n");
  const handleH2 = () => insertFormatting("\n## ", "\n");
  const handleH3 = () => insertFormatting("\n### ", "\n");

  const insertLink = () => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const linkMarkdown = `[${linkText || selectedText || 'link'}](${linkUrl})`;
    const newText = value.substring(0, start) + linkMarkdown + value.substring(end);
    
    onChange(newText);
    setLinkUrl("");
    setLinkText("");
    
    // Posicionar o cursor após o link
    setTimeout(() => {
      textarea.focus();
      const cursorPos = start + linkMarkdown.length;
      textarea.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  };

  const insertImage = () => {
    if (!imageUrl) return;
    
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const imageMarkdown = `![${imageAlt || 'imagem'}](${imageUrl})`;
    
    const newText = value.substring(0, start) + imageMarkdown + value.substring(start);
    onChange(newText);
    
    // Preview should show the image immediately
    const updatedHtml = marked.parse(newText, { async: false }) as string;
    setRenderedHtml(DOMPurify.sanitize(updatedHtml));
    
    setImageUrl("");
    setImageAlt("");
    
    // Posicionar o cursor após a imagem
    setTimeout(() => {
      textarea.focus();
      const cursorPos = start + imageMarkdown.length;
      textarea.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  };

  return (
    <div className={cn("w-full space-y-2", className)}>
      <div className="border rounded-t-md border-b-0 bg-background">
        <div className="flex flex-wrap items-center gap-1 p-1 border-b overflow-x-auto">
          <div className="flex items-center gap-1">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={handleBold}
              className="h-8 w-8 p-0"
              title="Negrito (Ctrl+B)"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={handleItalic}
              className="h-8 w-8 p-0"
              title="Itálico (Ctrl+I)"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={handleUnderline}
              className="h-8 w-8 p-0"
              title="Sublinhado"
            >
              <Underline className="h-4 w-4" />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={handleStrikethrough}
              className="h-8 w-8 p-0"
              title="Tachado"
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={handleCode}
              className="h-8 w-8 p-0"
              title="Código"
            >
              <Code className="h-4 w-4" />
            </Button>
          </div>

          <div className="h-4 w-px bg-border mx-1" />
          
          <div className="flex items-center gap-1">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={handleH1}
              className="h-8 px-2 text-xs"
              title="Título 1"
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={handleH2}
              className="h-8 px-2 text-xs"
              title="Título 2"
            >
              <Heading2 className="h-4 w-4" />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={handleH3}
              className="h-8 px-2 text-xs"
              title="Título 3"
            >
              <Heading3 className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="h-4 w-px bg-border mx-1" />
          
          <div className="flex items-center gap-1">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={handleAlignLeft}
              className="h-8 w-8 p-0"
              title="Alinhar à esquerda"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={handleAlignCenter}
              className="h-8 w-8 p-0"
              title="Centralizar"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={handleAlignRight}
              className="h-8 w-8 p-0"
              title="Alinhar à direita"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="h-4 w-px bg-border mx-1" />
          
          <div className="flex items-center gap-1">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={handleBulletList}
              className="h-8 w-8 p-0"
              title="Lista com marcadores"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={handleNumberedList}
              className="h-8 w-8 p-0"
              title="Lista numerada"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={handleQuote}
              className="h-8 w-8 p-0"
              title="Citação"
            >
              <Quote className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="h-4 w-px bg-border mx-1" />
          
          <div className="flex items-center gap-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  title="Inserir link"
                >
                  <Link2 className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Inserir Link</h4>
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="link-text">Texto do link</Label>
                      <Input 
                        id="link-text" 
                        value={linkText} 
                        onChange={(e) => setLinkText(e.target.value)} 
                        placeholder="Texto a ser exibido"
                      />
                    </div>
                    <div>
                      <Label htmlFor="link-url">URL</Label>
                      <Input 
                        id="link-url" 
                        value={linkUrl} 
                        onChange={(e) => setLinkUrl(e.target.value)} 
                        placeholder="https://exemplo.com"
                      />
                    </div>
                    <Button 
                      onClick={insertLink} 
                      disabled={!linkUrl}
                      className="w-full"
                    >
                      Inserir
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  title="Inserir imagem"
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Inserir Imagem</h4>
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="image-url">URL da imagem</Label>
                      <Input 
                        id="image-url" 
                        value={imageUrl} 
                        onChange={(e) => setImageUrl(e.target.value)} 
                        placeholder="https://exemplo.com/imagem.jpg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="image-alt">Texto alternativo</Label>
                      <Input 
                        id="image-alt" 
                        value={imageAlt} 
                        onChange={(e) => setImageAlt(e.target.value)} 
                        placeholder="Descrição da imagem"
                      />
                    </div>
                    <Button 
                      onClick={insertImage} 
                      disabled={!imageUrl}
                      className="w-full"
                    >
                      Inserir
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "edit" | "preview")} className="w-full">
          <div className="flex justify-between items-center px-2 py-1 border-b">
            <TabsList className="grid w-[180px] grid-cols-2">
              <TabsTrigger value="edit" className="flex items-center gap-1">
                <EditIcon className="h-4 w-4" />
                <span>Editor</span>
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>Visualizar</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="text-xs text-gray-500">
              Markdown suportado
            </div>
          </div>
          
          <TabsContent value="edit" className="mt-0 p-0">
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || "Escreva seu conteúdo em Markdown..."}
              className="border-0 rounded-t-none min-h-[300px] font-mono resize-y"
              style={{ minHeight }}
            />
          </TabsContent>
          
          <TabsContent value="preview" className="mt-0">
            <div 
              className="p-4 prose prose-slate max-w-none dark:prose-invert min-h-[300px] overflow-auto border-0"
              style={{ minHeight }}
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Editor tips */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>Atalhos: **negrito**, *itálico*, `código`, # título, {">"} citação, - lista</p>
      </div>
    </div>
  );
}
