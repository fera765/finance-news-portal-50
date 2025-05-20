
import { useState, useEffect, useRef } from "react";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { useStockData } from "@/hooks/useStocks";

const StockTicker = () => {
  const [tickerWidth, setTickerWidth] = useState(0);
  const tickerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const position = useRef(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Fetch stock data using our custom hook
  const { data: stockData = [], isLoading } = useStockData();
  
  // Set ticker width
  useEffect(() => {
    if (tickerRef.current) {
      setTickerWidth(tickerRef.current.scrollWidth);
    }
  }, [stockData]);
  
  // Handle animation
  useEffect(() => {
    const animate = () => {
      if (!isPaused) {
        position.current -= 0.5;
        if (position.current < -tickerWidth) {
          position.current = window.innerWidth;
        }
        
        if (tickerRef.current) {
          tickerRef.current.style.transform = `translateX(${position.current}px)`;
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, tickerWidth]);
  
  // Start with position at the edge of the screen
  useEffect(() => {
    position.current = window.innerWidth;
  }, []);
  
  if (isLoading) {
    return (
      <div className="w-full overflow-hidden bg-white py-2 px-4">
        <div className="h-6 flex gap-8 items-center animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-4 w-32 rounded"></div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="w-full overflow-hidden bg-white py-2 px-4" 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div ref={tickerRef} className="flex whitespace-nowrap">
        {stockData.map((stock, index) => (
          <div key={`${stock.symbol}-${index}`} className="flex items-center mr-10">
            <span className="font-medium">{stock.symbol}</span>
            <span className="mx-2">${stock.price.toFixed(2)}</span>
            <span 
              className={`flex items-center ${
                stock.change >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {stock.change >= 0 ? (
                <ArrowUpIcon className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownIcon className="h-3 w-3 mr-1" />
              )}
              {stock.changePercent.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockTicker;
