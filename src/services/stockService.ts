
import { api } from './api';

export interface StockSymbolSearchResult {
  symbol: string;
  name: string;
  type: string;
  region: string;
  marketOpen: string;
  marketClose: string;
  timezone: string;
  currency: string;
  matchScore: string;
}

export interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

// Função para buscar símbolos de ações
export const searchStockSymbols = async (query: string): Promise<StockSymbolSearchResult[]> => {
  if (!query || query.length < 2) return [];
  
  try {
    // Usamos o nosso próprio backend para fazer o proxy da API Alpha Vantage
    // para não expor a chave da API no frontend
    const response = await api.get(`/stock-search?query=${encodeURIComponent(query)}`);
    
    if (response.data && response.data.bestMatches) {
      return response.data.bestMatches.map((match: any) => ({
        symbol: match['1. symbol'],
        name: match['2. name'],
        type: match['3. type'],
        region: match['4. region'],
        marketOpen: match['5. marketOpen'],
        marketClose: match['6. marketClose'],
        timezone: match['7. timezone'],
        currency: match['8. currency'],
        matchScore: match['9. matchScore'],
      }));
    }
    return [];
  } catch (error) {
    console.error('Erro ao buscar símbolos de ações:', error);
    return [];
  }
};

// Obter dados completos de uma ação específica
export const getStockData = async (symbol: string): Promise<StockData | null> => {
  try {
    const response = await api.get(`/stock-data/${symbol}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao obter dados da ação ${symbol}:`, error);
    return null;
  }
};

// Obter dados de várias ações
export const getMultipleStockData = async (symbols: string[]): Promise<StockData[]> => {
  try {
    const response = await api.get('/stock-data', { params: { symbols: symbols.join(',') } });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter dados de múltiplas ações:', error);
    return [];
  }
};
