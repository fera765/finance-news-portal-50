
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStocks, getYahooStockData, addStock, removeStock, toggleStockEnabled } from "@/services/stockService";
import { toast } from "sonner";
import { Stock } from "@/services/stockService";

// Hook to fetch active stock symbols from database
export function useStockSymbols() {
  return useQuery({
    queryKey: ['stockSymbols'],
    queryFn: getStocks,
    staleTime: 60000, // 1 minute
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Hook to fetch real-time stock data from Yahoo Finance
export function useStockData() {
  const { data: symbols = [], isError } = useStockSymbols();
  
  return useQuery({
    queryKey: ['stocks', symbols],
    queryFn: () => getYahooStockData(symbols),
    staleTime: 60000, // 1 minute
    refetchInterval: 60000, // Refetch every minute
    refetchOnWindowFocus: true,
    enabled: symbols.length > 0 && !isError,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Hook for adding stocks
export function useAddStock() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (stock: { symbol: string; name: string }) => 
      addStock(stock),
    onSuccess: (success) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: ['stockSymbols'] });
        toast.success("Ação adicionada com sucesso");
      } else {
        toast.error("Esta ação já existe na lista");
      }
    },
    onError: () => {
      toast.error("Erro ao adicionar ação");
    }
  });
}

// Hook for removing stocks
export function useRemoveStock() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (symbol: string) => removeStock(symbol),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stockSymbols'] });
      toast.success("Ação removida com sucesso");
    },
    onError: () => {
      toast.error("Erro ao remover ação");
    }
  });
}

// Hook for toggling stock enabled status
export function useToggleStockEnabled() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ symbol, enabled }: { symbol: string; enabled: boolean }) => 
      toggleStockEnabled(symbol, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stockSymbols'] });
      toast.success("Status da ação atualizado com sucesso");
    },
    onError: () => {
      toast.error("Erro ao atualizar status da ação");
    }
  });
}
