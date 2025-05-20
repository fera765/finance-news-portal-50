
import { api } from './api';

export interface SeoSettings {
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string;
  siteFavicon: string;
  siteImage: string;
}

export interface SocialSettings {
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  linkedin: string;
}

export interface TrackingSettings {
  googleAnalytics: string;
  facebookPixel: string;
  tiktokPixel: string;
  customHeadCode: string;
  customBodyCode: string;
}

export interface Settings {
  id?: string;
  seo: SeoSettings;
  social: SocialSettings;
  tracking: TrackingSettings;
}

// Get all settings
export const getSettings = async (): Promise<Settings> => {
  try {
    // Verificar se há configurações na base
    const response = await api.get('/settings');
    const settingsArray = response.data;
    
    // Se existir alguma configuração, retornar a primeira
    if (settingsArray && settingsArray.length > 0) {
      return settingsArray[0];
    }
    
    // Se não houver configurações, retornar as padrões
    return {
      seo: {
        siteTitle: 'Finance News',
        siteDescription: 'O melhor portal de notícias financeiras do Brasil',
        siteKeywords: 'finanças, economia, investimentos, mercado de ações',
        siteFavicon: '',
        siteImage: ''
      },
      social: {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: '',
        linkedin: ''
      },
      tracking: {
        googleAnalytics: '',
        facebookPixel: '',
        tiktokPixel: '',
        customHeadCode: '',
        customBodyCode: ''
      }
    };
  } catch (error) {
    // Se ocorrer erro, retornar configurações padrão
    return {
      seo: {
        siteTitle: 'Finance News',
        siteDescription: 'O melhor portal de notícias financeiras do Brasil',
        siteKeywords: 'finanças, economia, investimentos, mercado de ações',
        siteFavicon: '',
        siteImage: ''
      },
      social: {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: '',
        linkedin: ''
      },
      tracking: {
        googleAnalytics: '',
        facebookPixel: '',
        tiktokPixel: '',
        customHeadCode: '',
        customBodyCode: ''
      }
    };
  }
};

// Update SEO settings
export const updateSeoSettings = async (seoSettings: SeoSettings): Promise<Settings> => {
  try {
    // Buscar configurações existentes
    let existingSettings: Settings;
    
    try {
      // Tentar obter configurações existentes
      const response = await api.get('/settings');
      const settingsArray = response.data;
      
      // Se existirem configurações, usar a primeira
      if (settingsArray && settingsArray.length > 0) {
        existingSettings = settingsArray[0];
      } else {
        // Se não existirem configurações, criar padrão
        existingSettings = await getSettings();
      }
    } catch (error) {
      // Se ocorrer erro, usar configurações padrão
      existingSettings = await getSettings();
    }
    
    // Preparar objeto atualizado
    const updatedSettings = {
      ...existingSettings,
      seo: seoSettings
    };
    
    // Determinar se deve criar ou atualizar
    if (existingSettings.id) {
      // Atualizar configurações existentes
      const { data } = await api.put(`/settings/${existingSettings.id}`, updatedSettings);
      return data;
    } else {
      // Criar novas configurações com ID fixo
      const { data } = await api.post('/settings', { 
        ...updatedSettings, 
        id: '1' 
      });
      return data;
    }
  } catch (error) {
    console.error('Erro ao atualizar configurações SEO:', error);
    throw new Error('Failed to update SEO settings');
  }
};

// Update social settings
export const updateSocialSettings = async (socialSettings: SocialSettings): Promise<Settings> => {
  try {
    // Buscar configurações existentes
    let existingSettings: Settings;
    
    try {
      // Tentar obter configurações existentes
      const response = await api.get('/settings');
      const settingsArray = response.data;
      
      // Se existirem configurações, usar a primeira
      if (settingsArray && settingsArray.length > 0) {
        existingSettings = settingsArray[0];
      } else {
        // Se não existirem configurações, criar padrão
        existingSettings = await getSettings();
      }
    } catch (error) {
      // Se ocorrer erro, usar configurações padrão
      existingSettings = await getSettings();
    }
    
    // Preparar objeto atualizado
    const updatedSettings = {
      ...existingSettings,
      social: socialSettings
    };
    
    // Determinar se deve criar ou atualizar
    if (existingSettings.id) {
      // Atualizar configurações existentes
      const { data } = await api.put(`/settings/${existingSettings.id}`, updatedSettings);
      return data;
    } else {
      // Criar novas configurações com ID fixo
      const { data } = await api.post('/settings', { 
        ...updatedSettings, 
        id: '1' 
      });
      return data;
    }
  } catch (error) {
    console.error('Erro ao atualizar configurações sociais:', error);
    throw new Error('Failed to update social settings');
  }
};

// Update tracking settings
export const updateTrackingSettings = async (trackingSettings: TrackingSettings): Promise<Settings> => {
  try {
    // Buscar configurações existentes
    let existingSettings: Settings;
    
    try {
      // Tentar obter configurações existentes
      const response = await api.get('/settings');
      const settingsArray = response.data;
      
      // Se existirem configurações, usar a primeira
      if (settingsArray && settingsArray.length > 0) {
        existingSettings = settingsArray[0];
      } else {
        // Se não existirem configurações, criar padrão
        existingSettings = await getSettings();
      }
    } catch (error) {
      // Se ocorrer erro, usar configurações padrão
      existingSettings = await getSettings();
    }
    
    // Preparar objeto atualizado
    const updatedSettings = {
      ...existingSettings,
      tracking: trackingSettings
    };
    
    // Determinar se deve criar ou atualizar
    if (existingSettings.id) {
      // Atualizar configurações existentes
      const { data } = await api.put(`/settings/${existingSettings.id}`, updatedSettings);
      return data;
    } else {
      // Criar novas configurações com ID fixo
      const { data } = await api.post('/settings', { 
        ...updatedSettings, 
        id: '1' 
      });
      return data;
    }
  } catch (error) {
    console.error('Erro ao atualizar configurações de tracking:', error);
    throw new Error('Failed to update tracking settings');
  }
};
