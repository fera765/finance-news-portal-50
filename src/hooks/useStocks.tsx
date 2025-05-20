
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
    retry: 3,
    // Handle errors through meta
    meta: {
      onError: (error: any) => {
        console.error("Error loading stock data:", error);
      }
    }
  });
}
