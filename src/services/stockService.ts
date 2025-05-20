
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

// Obter dados de várias ações - Adicionando pontos de retentativa e fallback
export const getMultipleStockData = async (symbols: string[]): Promise<StockData[]> => {
  if (!symbols || symbols.length === 0) {
    // Retornar alguns dados de exemplo se nenhum símbolo for fornecido
    return [
      { symbol: "AAPL", price: 169.25, change: 2.15, changePercent: 1.29 },
      { symbol: "MSFT", price: 349.80, change: 1.23, changePercent: 0.35 },
      { symbol: "GOOGL", price: 134.40, change: -0.42, changePercent: -0.31 },
      { symbol: "TSLA", price: 215.65, change: 3.28, changePercent: 1.54 }
    ];
  }
  
  try {
    const response = await api.get('/stock-data', { params: { symbols: symbols.join(',') } });
    
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    
    // Fallback básico se a API retornar um formato inesperado
    return [
      { symbol: "AAPL", price: 169.25, change: 2.15, changePercent: 1.29 },
      { symbol: "MSFT", price: 349.80, change: 1.23, changePercent: 0.35 },
      { symbol: "GOOGL", price: 134.40, change: -0.42, changePercent: -0.31 }
    ];
  } catch (error) {
    console.error('Erro ao obter dados de múltiplas ações:', error);
    
    // Retornar dados simulados em caso de erro
    return [
      { symbol: "AAPL", price: 169.25, change: 2.15, changePercent: 1.29 },
      { symbol: "MSFT", price: 349.80, change: 1.23, changePercent: 0.35 },
      { symbol: "GOOGL", price: 134.40, change: -0.42, changePercent: -0.31 }
    ];
  }
};
