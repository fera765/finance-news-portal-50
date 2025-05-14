
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

// Sample fallback data
const sampleStockData: StockData[] = [
  { symbol: "AAPL", price: 195.34, change: 2.45, changePercent: 1.27 },
  { symbol: "MSFT", price: 412.78, change: -3.21, changePercent: -0.77 },
  { symbol: "GOOGL", price: 178.56, change: 1.23, changePercent: 0.69 },
  { symbol: "AMZN", price: 186.32, change: -1.67, changePercent: -0.89 },
  { symbol: "TSLA", price: 245.67, change: 7.89, changePercent: 3.32 },
  { symbol: "META", price: 492.64, change: 8.76, changePercent: 1.81 },
  { symbol: "NVDA", price: 924.78, change: 14.32, changePercent: 1.57 },
  { symbol: "JPM", price: 195.45, change: -2.34, changePercent: -1.18 },
  { symbol: "BAC", price: 39.87, change: -0.56, changePercent: -1.39 },
  { symbol: "V", price: 278.92, change: 1.23, changePercent: 0.44 }
];

// Stock symbols to fetch
const stockSymbols = "AAPL,MSFT,GOOGL,AMZN,TSLA,META,NVDA,JPM,BAC,V";

// API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const StockTicker = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);
        
        // Make a request to our JSON Server API
        // In a real app, this would fetch from a real stock API
        // For this demo, we'll use a simplified endpoint in our JSON Server
        const response = await fetch(`${API_URL}/stock-data`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch stock data');
        }
        
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          setStocks(data);
        } else {
          console.log('Using sample stock data as fallback');
          setStocks(sampleStockData);
        }
        
      } catch (err) {
        console.error('Error fetching stock data:', err);
        // Fall back to sample data
        setStocks(sampleStockData);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStockData();
    
    // Set up a refresh interval (every 5 minutes)
    const intervalId = setInterval(fetchStockData, 5 * 60 * 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  
  const getStockElement = (stock: StockData, index: number) => {
    const isPositive = stock.change >= 0;
    const colorClass = isPositive ? "text-green-600" : "text-red-600";
    const Icon = isPositive ? TrendingUp : TrendingDown;
    
    return (
      <div key={stock.symbol} className="flex items-center whitespace-nowrap">
        {index !== 0 && <Separator orientation="vertical" className="mx-3 h-4" />}
        <div className="flex items-center space-x-2">
          <span className="font-semibold">{stock.symbol}</span>
          <span>${stock.price.toFixed(2)}</span>
          <span className={`flex items-center ${colorClass}`}>
            <Icon className="h-3 w-3 mr-1" />
            <span>{stock.change.toFixed(2)}</span>
            <span className="ml-1">({stock.changePercent.toFixed(2)}%)</span>
          </span>
        </div>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="py-2 overflow-hidden max-w-full">
        <div className="animate-pulse flex space-x-8 px-4">
          {Array(5).fill(0).map((_, index) => (
            <div key={index} className="h-5 w-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }
  
  // For mobile, we'll use a scrollable ticker
  if (isMobile) {
    return (
      <div className="py-2 overflow-x-auto scrollbar-hide max-w-full">
        <div className="flex space-x-3 px-4 min-w-max">
          {stocks.map((stock, index) => getStockElement(stock, index))}
        </div>
      </div>
    );
  }
  
  // For desktop, we'll use an animated ticker that moves automatically
  return (
    <div className="py-2 overflow-hidden relative max-w-full">
      <div className="ticker-track flex animate-ticker min-w-max">
        {stocks.concat(stocks).map((stock, index) => getStockElement(stock, index))}
      </div>
    </div>
  );
};

export default StockTicker;
