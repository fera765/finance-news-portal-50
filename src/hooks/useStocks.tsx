
import { useQuery } from "@tanstack/react-query";
import { getMultipleStockData } from "@/services/stockService";

const DEFAULT_SYMBOLS = ["AAPL", "MSFT", "GOOGL", "AMZN", "META"];

export function useStockData(symbols = DEFAULT_SYMBOLS) {
  return useQuery({
    queryKey: ['stocks', symbols],
    queryFn: () => getMultipleStockData(symbols),
    staleTime: 60000, // 1 minute
    refetchInterval: 60000, // Refetch every minute
    refetchOnWindowFocus: true,
    // Provide fallback data to prevent UI from breaking
    placeholderData: [
      { symbol: "AAPL", price: 175.05, change: 1.25, changePercent: 0.72 },
      { symbol: "MSFT", price: 350.12, change: 0.85, changePercent: 0.24 },
      { symbol: "GOOGL", price: 136.10, change: -0.32, changePercent: -0.23 }
    ]
  });
}
