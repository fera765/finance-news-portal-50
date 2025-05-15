
import { useState, useEffect, useRef } from "react";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Check, X } from "lucide-react";
import { searchStockSymbols, type StockSymbolSearchResult } from "@/services/stockService";
import { toast } from "sonner";

interface StockSearchProps {
  onSelect: (stock: StockSymbolSearchResult) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function StockSearch({ onSelect, placeholder = "Buscar ações...", disabled = false }: StockSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StockSymbolSearchResult[]>([]);
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
        const searchResults = await searchStockSymbols(query);
        setResults(searchResults);
      } catch (error) {
        console.error("Erro na pesquisa:", error);
        toast("Não foi possível buscar ações. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  const handleSelect = (stock: StockSymbolSearchResult) => {
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
              <CommandEmpty>Buscando ações...</CommandEmpty>
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
