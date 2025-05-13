
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, TrendingDown } from "lucide-react";

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

const StockTicker = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Using Alpha Vantage API as an alternative
        // For a production app, you would need to register for a key at https://www.alphavantage.co/
        // For now we'll use a fallback as the demo key has limited requests
        /* Uncomment this when you have a valid API key
        const response = await fetch(
          'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL,MSFT,GOOGL,AMZN,TSLA,META,NVDA,JPM,BAC,V&apikey=demo'
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch stock data');
        }
        
        const data = await response.json();
        
        // Process the API response
        // Implementation would depend on the actual API response format
        */
        
        // For now, always use sample data to ensure consistent display
        console.log('Using sample stock data');
        setStocks(sampleStockData);
        
      } catch (err) {
        console.error('Error fetching stock data:', err);
        setError('Could not load stock data');
        // Always fall back to sample data
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
      <div className="py-2 overflow-hidden">
        <div className="animate-pulse flex space-x-8">
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
        <div className="flex space-x-3 px-4">
          {stocks.map((stock, index) => getStockElement(stock, index))}
        </div>
      </div>
    );
  }
  
  // For desktop, we'll use an animated ticker that moves automatically
  return (
    <div className="py-2 overflow-hidden relative max-w-full">
      <div className="ticker-track flex animate-ticker">
        {stocks.concat(stocks).map((stock, index) => getStockElement(stock, index))}
      </div>
    </div>
  );
};

export default StockTicker;
