
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
