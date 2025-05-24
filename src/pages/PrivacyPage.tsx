
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { getPageContent } from "@/services/pageContentService";
import { Loader2 } from "lucide-react";
import DOMPurify from "dompurify";
import { marked } from "marked";

const PrivacyPage = () => {
  // Fetch privacy page content from database
  const { data: pageContent, isLoading, error } = useQuery({
    queryKey: ['page-content', 'privacy'],
    queryFn: () => getPageContent('privacy')
  });

  // Convert markdown to HTML
  const getContentHtml = (content: string) => {
    try {
      const rawHtml = marked.parse(content, { async: false }) as string;
      return DOMPurify.sanitize(rawHtml);
    } catch (error) {
      console.error("Erro ao processar conteúdo markdown:", error);
      return content;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !pageContent) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Política de Privacidade</h1>
          <p className="text-red-500">Erro ao carregar o conteúdo da página. Tente novamente mais tarde.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div 
          className="prose prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: getContentHtml(pageContent.content) }}
        />
      </div>
    </Layout>
  );
};

export default PrivacyPage;
