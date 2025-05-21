
import { api } from './api';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  favorite?: boolean;
}

interface StockView {
  id?: string;
  userId: string;
  stockSymbol: string;
  favorite: boolean;
}

// Define o tipo para resultados de pesquisa de símbolos de ações
export interface StockSymbolSearchResult {
  symbol: string;
  name: string;
  exchange?: string;
  type?: string;
}

// Get stock data
export const getStocks = async (): Promise<Stock[]> => {
  try {
    const { data } = await api.get('/stocks');
    return data || [];
  } catch (error) {
    console.error('Error fetching stocks:', error);
    // Fallback mock data
    return [
      { symbol: 'AAPL', name: 'Apple Inc.', price: 177.97, change: 0.74 },
      { symbol: 'MSFT', name: 'Microsoft Corporation', price: 337.22, change: -0.56 },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 131.84, change: 1.31 },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 124.31, change: 0.22 },
      { symbol: 'TSLA', name: 'Tesla, Inc.', price: 263.62, change: -2.44 },
    ];
  }
};

// Pesquisa símbolos de ações com base em uma consulta
export const searchStockSymbols = async (query: string): Promise<StockSymbolSearchResult[]> => {
  try {
    // Em um ambiente real, chamaríamos uma API para isso
    // const { data } = await api.get(`/stocks/search?q=${encodeURIComponent(query)}`);
    // return data || [];
    
    // Dados simulados para desenvolvimento
    const mockData = [
      { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ', type: 'Common Stock' },
      { symbol: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ', type: 'Common Stock' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', exchange: 'NASDAQ', type: 'Common Stock' },
      { symbol: 'GOOG', name: 'Alphabet Inc.', exchange: 'NASDAQ', type: 'Common Stock' },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', exchange: 'NASDAQ', type: 'Common Stock' },
      { symbol: 'META', name: 'Meta Platforms Inc.', exchange: 'NASDAQ', type: 'Common Stock' },
      { symbol: 'TSLA', name: 'Tesla, Inc.', exchange: 'NASDAQ', type: 'Common Stock' },
      { symbol: 'NVDA', name: 'NVIDIA Corporation', exchange: 'NASDAQ', type: 'Common Stock' },
      { symbol: 'NFLX', name: 'Netflix, Inc.', exchange: 'NASDAQ', type: 'Common Stock' },
      { symbol: 'JPM', name: 'JPMorgan Chase & Co.', exchange: 'NYSE', type: 'Common Stock' },
      { symbol: 'V', name: 'Visa Inc.', exchange: 'NYSE', type: 'Common Stock' },
      { symbol: 'JNJ', name: 'Johnson & Johnson', exchange: 'NYSE', type: 'Common Stock' },
      { symbol: 'WMT', name: 'Walmart Inc.', exchange: 'NYSE', type: 'Common Stock' },
      { symbol: 'PG', name: 'Procter & Gamble Co.', exchange: 'NYSE', type: 'Common Stock' },
      { symbol: 'MA', name: 'Mastercard Inc.', exchange: 'NYSE', type: 'Common Stock' },
      { symbol: 'DIS', name: 'The Walt Disney Company', exchange: 'NYSE', type: 'Common Stock' },
      { symbol: 'BAC', name: 'Bank of America Corp.', exchange: 'NYSE', type: 'Common Stock' },
      { symbol: 'INTC', name: 'Intel Corporation', exchange: 'NASDAQ', type: 'Common Stock' },
      { symbol: 'XOM', name: 'Exxon Mobil Corporation', exchange: 'NYSE', type: 'Common Stock' },
      { symbol: 'VZ', name: 'Verizon Communications Inc.', exchange: 'NYSE', type: 'Common Stock' },
    ];
    
    // Filtra baseado na consulta (símbolo ou nome)
    const lowercaseQuery = query.toLowerCase();
    const results = mockData.filter(
      stock => 
        stock.symbol.toLowerCase().includes(lowercaseQuery) || 
        stock.name.toLowerCase().includes(lowercaseQuery)
    );
    
    return results.slice(0, 10); // Limitar a 10 resultados
  } catch (error) {
    console.error('Error searching stock symbols:', error);
    return [];
  }
};

// Get favorite stocks for a user
export const getFavoriteStocks = async (userId: string): Promise<string[]> => {
  try {
    const { data } = await api.get('/stockViews', {
      params: {
        userId,
        favorite: true,
      }
    });
    
    return data?.map((item: StockView) => item.stockSymbol) || [];
  } catch (error) {
    console.error('Error fetching favorite stocks:', error);
    return [];
  }
};

// Toggle favorite status for a stock
export const toggleFavoriteStock = async (userId: string, stockSymbol: string, favorite: boolean): Promise<boolean> => {
  try {
    // Check if entry already exists
    const { data: existingEntries } = await api.get('/stockViews', {
      params: {
        userId,
        stockSymbol,
      }
    });
    
    if (existingEntries && existingEntries.length > 0) {
      // Update existing entry
      const entry = existingEntries[0];
      await api.patch(`/stockViews/${entry.id}`, { favorite });
    } else {
      // Create new entry
      await api.post('/stockViews', {
        userId,
        stockSymbol,
        favorite,
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error toggling favorite stock:', error);
    return false;
  }
};

// Get multiple stocks data por symbols
export const getMultipleStockData = async (symbols: string[]): Promise<Stock[]> => {
  try {
    // Em produção, isso faria uma chamada API para buscar dados atualizados
    // const { data } = await api.get('/stocks/batch', { params: { symbols: symbols.join(',') } });
    // return data || [];
    
    // Dados simulados para desenvolvimento
    const mockStocks: Record<string, Stock> = {
      'AAPL': { symbol: 'AAPL', name: 'Apple Inc.', price: 177.97, change: 0.74 },
      'MSFT': { symbol: 'MSFT', name: 'Microsoft Corporation', price: 337.22, change: -0.56 },
      'GOOGL': { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 131.84, change: 1.31 },
      'AMZN': { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 124.31, change: 0.22 },
      'TSLA': { symbol: 'TSLA', name: 'Tesla, Inc.', price: 263.62, change: -2.44 },
      'META': { symbol: 'META', name: 'Meta Platforms Inc.', price: 326.49, change: 1.87 },
      'NVDA': { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 834.88, change: 3.21 },
      'JPM': { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 169.53, change: 0.42 },
      'BAC': { symbol: 'BAC', name: 'Bank of America Corp.', price: 34.79, change: -0.12 },
      'V': { symbol: 'V', name: 'Visa Inc.', price: 267.40, change: 0.63 },
      'JNJ': { symbol: 'JNJ', name: 'Johnson & Johnson', price: 151.76, change: -0.35 },
      'WMT': { symbol: 'WMT', name: 'Walmart Inc.', price: 59.85, change: 0.28 },
      'PG': { symbol: 'PG', name: 'Procter & Gamble Co.', price: 162.43, change: 0.15 },
      'MA': { symbol: 'MA', name: 'Mastercard Inc.', price: 452.91, change: 1.19 },
      'DIS': { symbol: 'DIS', name: 'The Walt Disney Company', price: 113.87, change: -0.65 },
    };
    
    return symbols.map(symbol => 
      mockStocks[symbol] || { 
        symbol, 
        name: `Unknown (${symbol})`, 
        price: 0, 
        change: 0 
      }
    );
  } catch (error) {
    console.error('Error fetching multiple stocks:', error);
    return [];
  }
};
