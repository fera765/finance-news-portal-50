
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { getPageContent } from "@/services/pageContentService";
import { Loader2 } from "lucide-react";
import DOMPurify from "dompurify";
import { marked } from "marked";

const AboutPage = () => {
  // Fetch about page content from database
  const { data: pageContent, isLoading, error } = useQuery({
    queryKey: ['page-content', 'about'],
    queryFn: () => getPageContent('about')
  });

  // Convert markdown to HTML
  const getContentHtml = (content: string) => {
    try {
      const rawHtml = marked.parse(content, { async: false }) as string;
      return DOMPurify.sanitize(rawHtml);
    } catch (error) {
      console.error("Error parsing markdown content:", error);
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
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Sobre a Finance News</h1>
          <p className="text-red-500">Erro ao carregar o conteúdo da página. Tente novamente mais tarde.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <img 
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
            alt="Finance News Team" 
            className="w-full h-64 md:h-80 object-cover rounded-lg mb-4"
          />
        </div>
        
        <div 
          className="prose prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: getContentHtml(pageContent.content) }}
        />
      </div>
    </Layout>
  );
};

export default AboutPage;
