
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
    const { data } = await api.get('/settings/1');
    return data;
  } catch (error) {
    // If settings don't exist yet, return default settings
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
    // Try to get existing settings first
    const existingSettings = await getSettings();
    const updatedSettings = {
      ...existingSettings,
      seo: seoSettings
    };
    
    if (existingSettings.id) {
      // Update existing settings
      const { data } = await api.put(`/settings/${existingSettings.id}`, updatedSettings);
      return data;
    } else {
      // Create new settings
      const { data } = await api.post('/settings', { ...updatedSettings, id: '1' });
      return data;
    }
  } catch (error) {
    throw new Error('Failed to update SEO settings');
  }
};

// Update social settings
export const updateSocialSettings = async (socialSettings: SocialSettings): Promise<Settings> => {
  try {
    // Try to get existing settings first
    const existingSettings = await getSettings();
    const updatedSettings = {
      ...existingSettings,
      social: socialSettings
    };
    
    if (existingSettings.id) {
      // Update existing settings
      const { data } = await api.put(`/settings/${existingSettings.id}`, updatedSettings);
      return data;
    } else {
      // Create new settings
      const { data } = await api.post('/settings', { ...updatedSettings, id: '1' });
      return data;
    }
  } catch (error) {
    throw new Error('Failed to update social settings');
  }
};

// Update tracking settings
export const updateTrackingSettings = async (trackingSettings: TrackingSettings): Promise<Settings> => {
  try {
    // Try to get existing settings first
    const existingSettings = await getSettings();
    const updatedSettings = {
      ...existingSettings,
      tracking: trackingSettings
    };
    
    if (existingSettings.id) {
      // Update existing settings
      const { data } = await api.put(`/settings/${existingSettings.id}`, updatedSettings);
      return data;
    } else {
      // Create new settings
      const { data } = await api.post('/settings', { ...updatedSettings, id: '1' });
      return data;
    }
  } catch (error) {
    throw new Error('Failed to update tracking settings');
  }
};
