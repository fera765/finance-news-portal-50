
import { api } from './api';

// Interface for stock data
export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  lastUpdated: string;
}

// Mock stock data for fallback when API is unavailable
const MOCK_STOCKS: Stock[] = [
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
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc',
    price: 178.25,
    change: 1.45,
    lastUpdated: new Date().toISOString()
  },
  {
    symbol: 'META',
    name: 'Meta Platforms Inc',
    price: 485.12,
    change: -0.78,
    lastUpdated: new Date().toISOString()
  }
];

// Get all stocks from the API with improved error handling
export const getStocks = async (): Promise<Stock[]> => {
  try {
    console.log('Fetching stocks from API...');
    const { data } = await api.get('/stocks');
    console.log('Stocks fetched successfully:', data);
    return data || [];
  } catch (error) {
    console.error('Error fetching stocks:', error);
    console.log('Using fallback stock data');
    
    // Return fallback data in case of error
    return MOCK_STOCKS;
  }
};

// Get a specific stock by symbol
export const getStock = async (symbol: string): Promise<Stock | null> => {
  try {
    const { data } = await api.get(`/stocks?symbol=${symbol}`);
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error(`Error fetching stock ${symbol}:`, error);
    
    // Return fallback stock if available
    const mockStock = MOCK_STOCKS.find(stock => stock.symbol === symbol);
    return mockStock || null;
  }
};

// Get favorite stocks for a user
export const getFavoriteStocks = async (userId: string): Promise<string[]> => {
  try {
    const { data } = await api.get(`/stockViews?userId=${userId}&favorite=true`);
    return data?.map((item: any) => item.stockSymbol) || [];
  } catch (error) {
    console.error('Error fetching favorite stocks:', error);
    // Return sample favorites as fallback
    return ['AAPL', 'MSFT'];
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
    
    // In case of error, still return success for demo purposes
    // and store the preference in localStorage temporarily
    try {
      const storageKey = `favorite_stock_${userId}_${stockSymbol}`;
      if (favorite) {
        localStorage.setItem(storageKey, 'true');
      } else {
        localStorage.removeItem(storageKey);
      }
      console.log('Stored stock preference in localStorage as fallback');
      return true;
    } catch (e) {
      console.error('Failed to store in localStorage:', e);
      return false;
    }
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
    
    // Filter from mock stocks as fallback
    return MOCK_STOCKS.filter(stock => 
      stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase())
    );
  }
};
