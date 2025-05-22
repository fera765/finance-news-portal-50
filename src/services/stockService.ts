
import { api } from './api';
import yahooFinance from 'yahoo-finance2';

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

// Search for stocks using Yahoo Finance
export const searchYahooStocks = async (query: string): Promise<StockSymbolSearchResult[]> => {
  try {
    const results = await yahooFinance.search(query);
    
    // Filter only equity quotes
    const stocks = results.quotes
      .filter(quote => quote.quoteType === 'EQUITY')
      .map(quote => ({
        symbol: quote.symbol,
        name: quote.shortname || quote.longname || quote.symbol,
        exchange: quote.exchange,
        type: quote.quoteType
      }));
    
    return stocks.slice(0, 10); // Limit to 10 results
  } catch (error) {
    console.error('Error searching Yahoo Finance:', error);
    return [];
  }
};

// Get real-time stock data from Yahoo Finance
export const getYahooStockData = async (symbols: string[]): Promise<Stock[]> => {
  try {
    if (!symbols.length) return [];
    
    const results = await Promise.all(
      symbols.map(async (symbol) => {
        try {
          const quote = await yahooFinance.quote(symbol);
          return {
            symbol,
            name: quote.shortName || quote.longName || symbol,
            price: quote.regularMarketPrice || 0,
            change: quote.regularMarketChangePercent || 0
          };
        } catch (err) {
          console.error(`Error fetching data for ${symbol}:`, err);
          return {
            symbol,
            name: symbol,
            price: 0,
            change: 0
          };
        }
      })
    );
    
    return results;
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
