
import { api } from './api';

// Interface for stock data
export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  lastUpdated: string;
}

// Get all stocks from the API
export const getStocks = async (): Promise<Stock[]> => {
  try {
    const { data } = await api.get('/stocks');
    return data || [];
  } catch (error) {
    console.error('Error fetching stocks:', error);
    
    // Return fallback data in case of error
    return [
      {
        symbol: 'AAPL',
        name: 'Apple Inc',
        price: 173.57,
        change: 2.14,
        lastUpdated: new Date().toISOString()
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        price: 368.63,
        change: 1.02,
        lastUpdated: new Date().toISOString()
      },
      {
        symbol: 'GOOGL',
        name: 'Alphabet Inc',
        price: 139.69,
        change: -0.34,
        lastUpdated: new Date().toISOString()
      }
    ];
  }
};

// Get a specific stock by symbol
export const getStock = async (symbol: string): Promise<Stock | null> => {
  try {
    const { data } = await api.get(`/stocks?symbol=${symbol}`);
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error(`Error fetching stock ${symbol}:`, error);
    return null;
  }
};

// Get favorite stocks for a user
export const getFavoriteStocks = async (userId: string): Promise<string[]> => {
  try {
    const { data } = await api.get(`/stockViews?userId=${userId}&favorite=true`);
    return data?.map((item: any) => item.stockSymbol) || [];
  } catch (error) {
    console.error('Error fetching favorite stocks:', error);
    // Return an empty array as fallback
    return [];
  }
};

// Toggle favorite status for a stock
export const toggleFavoriteStock = async (
  userId: string,
  stockSymbol: string,
  favorite: boolean
): Promise<boolean> => {
  try {
    // Check if the stock view already exists
    const { data: existing } = await api.get(
      `/stockViews?userId=${userId}&stockSymbol=${stockSymbol}`
    );

    if (existing && existing.length > 0) {
      // Update existing record
      const id = existing[0].id;
      await api.patch(`/stockViews/${id}`, { favorite });
    } else {
      // Create new record
      await api.post('/stockViews', {
        userId,
        stockSymbol,
        favorite,
        id: `${Date.now()}`
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error toggling favorite stock:', error);
    return false;
  }
};

// Search for stocks by name or symbol
export const searchStocks = async (query: string): Promise<Stock[]> => {
  try {
    if (!query || query.trim() === '') {
      return [];
    }

    const formattedQuery = query.toLowerCase().trim();
    const { data } = await api.get('/stocks');
    
    return data.filter((stock: Stock) => 
      stock.symbol.toLowerCase().includes(formattedQuery) ||
      stock.name.toLowerCase().includes(formattedQuery)
    );
  } catch (error) {
    console.error('Error searching stocks:', error);
    return [];
  }
};
