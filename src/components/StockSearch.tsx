
import { useState, useEffect, useRef } from "react";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { searchYahooStocks } from "@/services/stockService";

export interface StockSearchResult {
  symbol: string;
  name: string;
  exchange?: string;
}

interface StockSearchProps {
  onSelect: (stock: StockSearchResult) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function StockSearch({ onSelect, placeholder = "Buscar ações...", disabled = false }: StockSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StockSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    // Limpa o timeout anterior
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Define um novo timeout para evitar múltiplas chamadas API enquanto o usuário digita
    searchTimeoutRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const searchResults = await searchYahooStocks(query);
        setResults(searchResults);
      } catch (error) {
        console.error("Erro na pesquisa:", error);
        toast("Não foi possível buscar ações. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  const handleSelect = (stock: StockSearchResult) => {
    onSelect(stock);
    setOpen(false);
    setQuery("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          role="combobox" 
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          <div className="flex items-center">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <span>{placeholder}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full min-w-[300px]" align="start">
        <Command>
          <CommandInput
            placeholder="Digite o nome ou símbolo..."
            value={query}
            onValueChange={setQuery}
            className="h-9"
          />
          <CommandList>
            {loading && (
              <CommandEmpty className="py-6 text-center">
                <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                Buscando ações...
              </CommandEmpty>
            )}
            {!loading && query.length >= 2 && results.length === 0 && (
              <CommandEmpty>Nenhuma ação encontrada</CommandEmpty>
            )}
            {!loading && results.length > 0 && (
              <CommandGroup heading="Resultados">
                {results.map((stock) => (
                  <CommandItem
                    key={stock.symbol}
                    value={`${stock.symbol}-${stock.name}`}
                    onSelect={() => handleSelect(stock)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <span className="font-bold">{stock.symbol}</span>
                        <span className="ml-2 text-sm text-muted-foreground">{stock.name}</span>
                        {stock.exchange && (
                          <span className="ml-2 text-xs bg-slate-100 px-1 py-0.5 rounded">
                            {stock.exchange}
                          </span>
                        )}
                      </div>
                      <Check className="h-4 w-4 opacity-0 group-data-[selected=true]:opacity-100" />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
