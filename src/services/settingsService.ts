
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

export interface StockSymbol {
  symbol: string;
  name: string;
  enabled: boolean;
}

export interface StockTickerSettings {
  enabled: boolean;
  autoRefreshInterval: number;
  maxStocksToShow: number;
  symbols: StockSymbol[];
}

export interface Settings {
  id?: string;
  seo: SeoSettings;
  social: SocialSettings;
  tracking: TrackingSettings;
  stockTicker?: StockTickerSettings;
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
    return getDefaultSettings();
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    // Se ocorrer erro, retornar configurações padrão
    return getDefaultSettings();
  }
};

// Default settings
const getDefaultSettings = (): Settings => {
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
    },
    stockTicker: {
      enabled: true,
      autoRefreshInterval: 5,
      maxStocksToShow: 10,
      symbols: [
        { symbol: "AAPL", name: "Apple Inc.", enabled: true },
        { symbol: "MSFT", name: "Microsoft Corporation", enabled: true },
        { symbol: "GOOGL", name: "Alphabet Inc.", enabled: true }
      ]
    }
  };
};

// Update settings helper function
const updateSettings = async (settings: Settings): Promise<Settings> => {
  try {
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
        existingSettings = getDefaultSettings();
      }
    } catch (error) {
      // Se ocorrer erro, usar configurações padrão
      existingSettings = getDefaultSettings();
    }
    
    // Determinar se deve criar ou atualizar
    if (existingSettings.id) {
      // Atualizar configurações existentes
      const { data } = await api.put(`/settings/${existingSettings.id}`, settings);
      return data;
    } else {
      // Criar novas configurações com ID fixo
      const { data } = await api.post('/settings', { 
        ...settings, 
        id: '1' 
      });
      return data;
    }
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    throw new Error('Failed to update settings');
  }
};

// Update SEO settings
export const updateSeoSettings = async (seoSettings: SeoSettings): Promise<Settings> => {
  try {
    const existingSettings = await getSettings();
    
    // Preparar objeto atualizado
    const updatedSettings = {
      ...existingSettings,
      seo: seoSettings
    };
    
    return await updateSettings(updatedSettings);
  } catch (error) {
    console.error('Erro ao atualizar configurações SEO:', error);
    throw new Error('Failed to update SEO settings');
  }
};

// Update social settings
export const updateSocialSettings = async (socialSettings: SocialSettings): Promise<Settings> => {
  try {
    const existingSettings = await getSettings();
    
    // Preparar objeto atualizado
    const updatedSettings = {
      ...existingSettings,
      social: socialSettings
    };
    
    return await updateSettings(updatedSettings);
  } catch (error) {
    console.error('Erro ao atualizar configurações sociais:', error);
    throw new Error('Failed to update social settings');
  }
};

// Update tracking settings
export const updateTrackingSettings = async (trackingSettings: TrackingSettings): Promise<Settings> => {
  try {
    const existingSettings = await getSettings();
    
    // Preparar objeto atualizado
    const updatedSettings = {
      ...existingSettings,
      tracking: trackingSettings
    };
    
    return await updateSettings(updatedSettings);
  } catch (error) {
    console.error('Erro ao atualizar configurações de tracking:', error);
    throw new Error('Failed to update tracking settings');
  }
};

// Update stock ticker settings
export const updateStockTickerSettings = async (stockTickerSettings: StockTickerSettings): Promise<Settings> => {
  try {
    const existingSettings = await getSettings();
    
    // Preparar objeto atualizado
    const updatedSettings = {
      ...existingSettings,
      stockTicker: stockTickerSettings
    };
    
    return await updateSettings(updatedSettings);
  } catch (error) {
    console.error('Erro ao atualizar configurações do ticker de ações:', error);
    throw new Error('Failed to update stock ticker settings');
  }
};
