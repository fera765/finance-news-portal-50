
import { api } from './api';

export interface PageContent {
  id: string;
  slug: string;
  title: string;
  content: string;
  lastUpdated: string;
}

// Get all page contents
export const getPageContents = async (): Promise<PageContent[]> => {
  try {
    const response = await api.get('/page-contents');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar conteúdos das páginas:', error);
    throw new Error('Failed to fetch page contents');
  }
};

// Get specific page content by slug
export const getPageContent = async (slug: string): Promise<PageContent | null> => {
  try {
    const response = await api.get('/page-contents');
    const pageContents = response.data;
    return pageContents.find((page: PageContent) => page.slug === slug) || null;
  } catch (error) {
    console.error(`Erro ao buscar conteúdo da página ${slug}:`, error);
    throw new Error(`Failed to fetch page content for ${slug}`);
  }
};

// Update page content
export const updatePageContent = async (pageContent: Partial<PageContent> & { id: string }): Promise<PageContent> => {
  try {
    const updatedContent = {
      ...pageContent,
      lastUpdated: new Date().toISOString()
    };
    
    const response = await api.put(`/page-contents/${pageContent.id}`, updatedContent);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar conteúdo da página:', error);
    throw new Error('Failed to update page content');
  }
};

// Create new page content
export const createPageContent = async (pageContent: Omit<PageContent, 'lastUpdated'>): Promise<PageContent> => {
  try {
    const newContent = {
      ...pageContent,
      lastUpdated: new Date().toISOString()
    };
    
    const response = await api.post('/page-contents', newContent);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar conteúdo da página:', error);
    throw new Error('Failed to create page content');
  }
};
