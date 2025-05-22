
import { api } from './api';

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  favorite?: boolean;
}

export interface StockView {
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

// Search for stocks using a server-side API (mocked for now)
export const searchYahooStocks = async (query: string): Promise<StockSymbolSearchResult[]> => {
  try {
    // For now, we'll use a simple mock that returns common stocks based on the query
    // In a real app, this would call a server-side API that uses yahoo-finance
    const mockResults: StockSymbolSearchResult[] = [];
    
    // Some mock data for common Brazilian and US stocks
    const stockDatabase = [
      { symbol: 'PETR4.SA', name: 'Petrobras SA', exchange: 'BVMF', type: 'Equity' },
      { symbol: 'PETR3.SA', name: 'Petrobras SA', exchange: 'BVMF', type: 'Equity' },
      { symbol: 'VALE3.SA', name: 'Vale SA', exchange: 'BVMF', type: 'Equity' },
      { symbol: 'ITUB4.SA', name: 'Itau Unibanco Holding', exchange: 'BVMF', type: 'Equity' },
      { symbol: 'BBDC4.SA', name: 'Banco Bradesco SA', exchange: 'BVMF', type: 'Equity' },
      { symbol: 'BBAS3.SA', name: 'Banco do Brasil SA', exchange: 'BVMF', type: 'Equity' },
      { symbol: 'AAPL', name: 'Apple Inc', exchange: 'NASDAQ', type: 'Equity' },
      { symbol: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ', type: 'Equity' },
      { symbol: 'GOOGL', name: 'Alphabet Inc', exchange: 'NASDAQ', type: 'Equity' },
      { symbol: 'AMZN', name: 'Amazon.com Inc', exchange: 'NASDAQ', type: 'Equity' },
      { symbol: 'TSLA', name: 'Tesla Inc', exchange: 'NASDAQ', type: 'Equity' },
      { symbol: 'META', name: 'Meta Platforms Inc', exchange: 'NASDAQ', type: 'Equity' },
      { symbol: 'BRK-B', name: 'Berkshire Hathaway Inc', exchange: 'NYSE', type: 'Equity' },
      { symbol: 'JPM', name: 'JPMorgan Chase & Co', exchange: 'NYSE', type: 'Equity' },
      { symbol: 'V', name: 'Visa Inc', exchange: 'NYSE', type: 'Equity' },
      { symbol: 'BAC', name: 'Bank of America Corp', exchange: 'NYSE', type: 'Equity' },
      { symbol: 'WMT', name: 'Walmart Inc', exchange: 'NYSE', type: 'Equity' },
      { symbol: 'PG', name: 'Procter & Gamble Co', exchange: 'NYSE', type: 'Equity' },
    ];
    
    // Simple search algorithm to find matching stocks
    if (query.length >= 2) {
      const lowercaseQuery = query.toLowerCase();
      const matches = stockDatabase.filter(
        stock => 
          stock.symbol.toLowerCase().includes(lowercaseQuery) || 
          stock.name.toLowerCase().includes(lowercaseQuery)
      );
      mockResults.push(...matches.slice(0, 10)); // Limit to 10 results
    }
    
    return mockResults;
  } catch (error) {
    console.error('Error searching stocks:', error);
    return [];
  }
};

// Get mock stock data for demo purposes
export const getYahooStockData = async (symbols: string[]): Promise<Stock[]> => {
  try {
    if (!symbols.length) return [];
    
    // In a real app, this would call a server-side API that uses yahoo-finance
    // For now, generate random but realistic stock data
    return symbols.map(symbol => {
      // Generate a random price between $10 and $500
      const price = Math.random() * 490 + 10;
      
      // Generate a random percentage change between -5% and 5%
      const change = (Math.random() * 10) - 5;
      
      return {
        symbol,
        name: symbol,
        price: parseFloat(price.toFixed(2)),
        change: parseFloat(change.toFixed(2))
      };
    });
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return [];
  }
};

// Get stock data
export const getStocks = async (): Promise<string[]> => {
  try {
    const { data: settings } = await api.get('/settings/1');
    return settings?.stockTicker?.symbols.map((s: any) => s.symbol) || [];
  } catch (error) {
    console.error('Error fetching stocks from settings:', error);
    return [];
  }
};

// Add a stock to the settings
export const addStock = async (stock: { symbol: string; name: string }): Promise<boolean> => {
  try {
    // Get current settings
    const { data: settings } = await api.get('/settings/1');
    
    // Check if stock already exists
    const symbols = settings?.stockTicker?.symbols || [];
    if (symbols.some((s: any) => s.symbol === stock.symbol)) {
      return false; // Stock already exists
    }
    
    // Add new stock
    const updatedSymbols = [...symbols, { symbol: stock.symbol, name: stock.name, enabled: true }];
    
    // Update settings
    await api.patch('/settings/1', {
      stockTicker: {
        ...settings.stockTicker,
        symbols: updatedSymbols
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error adding stock:', error);
    return false;
  }
};

// Remove a stock from settings
export const removeStock = async (symbol: string): Promise<boolean> => {
  try {
    // Get current settings
    const { data: settings } = await api.get('/settings/1');
    
    // Remove stock
    const symbols = settings?.stockTicker?.symbols || [];
    const updatedSymbols = symbols.filter((s: any) => s.symbol !== symbol);
    
    // Update settings
    await api.patch('/settings/1', {
      stockTicker: {
        ...settings.stockTicker,
        symbols: updatedSymbols
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error removing stock:', error);
    return false;
  }
};

// Toggle stock enabled status
export const toggleStockEnabled = async (symbol: string, enabled: boolean): Promise<boolean> => {
  try {
    // Get current settings
    const { data: settings } = await api.get('/settings/1');
    
    // Update stock enabled status
    const symbols = settings?.stockTicker?.symbols || [];
    const updatedSymbols = symbols.map((s: any) => 
      s.symbol === symbol ? { ...s, enabled } : s
    );
    
    // Update settings
    await api.patch('/settings/1', {
      stockTicker: {
        ...settings.stockTicker,
        symbols: updatedSymbols
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error toggling stock enabled status:', error);
    return false;
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
