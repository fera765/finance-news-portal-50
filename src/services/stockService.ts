
import { api } from './api';

// Define stock data type
export interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface StockSymbolSearchResult {
  symbol: string;
  name: string;
  exchange?: string;
}

// Mock data for fallbacks
const MOCK_STOCK_DATA: StockData[] = [
  { symbol: "AAPL", price: 175.05, change: 1.25, changePercent: 0.72 },
  { symbol: "MSFT", price: 350.12, change: 0.85, changePercent: 0.24 },
  { symbol: "GOOGL", price: 136.10, change: -0.32, changePercent: -0.23 },
  { symbol: "AMZN", price: 178.35, change: 2.41, changePercent: 1.37 },
  { symbol: "META", price: 487.95, change: -1.15, changePercent: -0.23 },
  { symbol: "TSLA", price: 172.63, change: -3.82, changePercent: -2.16 },
  { symbol: "NVDA", price: 950.02, change: 15.30, changePercent: 1.64 },
  { symbol: "JPM", price: 198.48, change: 0.37, changePercent: 0.19 }
];

// Mock search results
const MOCK_SYMBOL_SEARCH: StockSymbolSearchResult[] = [
  { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ" },
  { symbol: "MSFT", name: "Microsoft Corporation", exchange: "NASDAQ" },
  { symbol: "GOOGL", name: "Alphabet Inc.", exchange: "NASDAQ" },
  { symbol: "GOOG", name: "Alphabet Inc. Class C", exchange: "NASDAQ" },
  { symbol: "AMZN", name: "Amazon.com Inc.", exchange: "NASDAQ" },
  { symbol: "META", name: "Meta Platforms Inc.", exchange: "NASDAQ" },
  { symbol: "TSLA", name: "Tesla Inc.", exchange: "NASDAQ" },
  { symbol: "NVDA", name: "NVIDIA Corporation", exchange: "NASDAQ" },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", exchange: "NYSE" },
  { symbol: "BAC", name: "Bank of America Corp.", exchange: "NYSE" },
  { symbol: "WMT", name: "Walmart Inc.", exchange: "NYSE" },
  { symbol: "PG", name: "Procter & Gamble Co.", exchange: "NYSE" }
];

// Fetch data for a single stock
export const getStockData = async (symbol: string): Promise<StockData> => {
  try {
    const { data } = await api.get(`/stocks/${symbol}`);
    return data;
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol}:`, error);
    // Return mock data for the requested symbol
    const mockStock = MOCK_STOCK_DATA.find(stock => stock.symbol === symbol);
    return mockStock || { 
      symbol, 
      price: 100 + Math.random() * 200, 
      change: (Math.random() * 10) - 5,
      changePercent: (Math.random() * 2) - 1 
    };
  }
};

// Fetch data for multiple stocks at once
export const getMultipleStockData = async (symbols: string[]): Promise<StockData[]> => {
  try {
    // In a real API you might have a batch endpoint, here we're simulating it
    const requests = symbols.map(symbol => getStockData(symbol));
    const results = await Promise.all(requests);
    return results;
  } catch (error) {
    console.error('Error fetching multiple stock data:', error);
    // Filter mock data to only return the requested symbols
    return MOCK_STOCK_DATA.filter(stock => symbols.includes(stock.symbol));
  }
};

// Search for stock symbols
export const searchStockSymbols = async (query: string): Promise<StockSymbolSearchResult[]> => {
  try {
    const { data } = await api.get(`/stocks/search`, {
      params: { q: query }
    });
    return data;
  } catch (error) {
    console.error(`Error searching for stocks with query ${query}:`, error);
    // Filter mock data based on search query
    return MOCK_SYMBOL_SEARCH.filter(
      stock => 
        stock.symbol.toLowerCase().includes(query.toLowerCase()) || 
        stock.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10); // Return max 10 results
  }
};
