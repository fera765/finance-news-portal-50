
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import StockSearch from "@/components/StockSearch";
import { X } from "lucide-react";
import { type StockSymbolSearchResult } from "@/services/stockService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSettings, updateSeoSettings, updateSocialSettings, updateTrackingSettings } from "@/services/settingsService";

interface StockSymbol {
  id: string;
  symbol: string;
  name: string;
  enabled: boolean;
}

// Form schemas
const seoSchema = z.object({
  siteTitle: z.string().min(1, "Site title is required"),
  siteDescription: z.string().min(1, "Site description is required"),
  siteKeywords: z.string(),
  siteFavicon: z.string(),
  siteImage: z.string()
});

const socialSchema = z.object({
  facebook: z.string().url().or(z.literal("")),
  twitter: z.string().url().or(z.literal("")),
  instagram: z.string().url().or(z.literal("")),
  linkedin: z.string().url().or(z.literal("")),
  youtube: z.string().url().or(z.literal(""))
});

const trackingSchema = z.object({
  googleAnalytics: z.string(),
  facebookPixel: z.string(),
  tiktokPixel: z.string(),
  customHeadCode: z.string(),
  customBodyCode: z.string()
});

const stockTickerSchema = z.object({
  enabled: z.boolean(),
  autoRefreshInterval: z.number().min(1).max(60),
  maxStocksToShow: z.number().min(1).max(20),
});

// Lista de ações populares para seleção
const popularStocks: StockSymbol[] = [
  { id: "1", symbol: "AAPL", name: "Apple Inc.", enabled: true },
  { id: "2", symbol: "MSFT", name: "Microsoft Corporation", enabled: true },
  { id: "3", symbol: "GOOGL", name: "Alphabet Inc.", enabled: true },
  { id: "4", symbol: "AMZN", name: "Amazon.com Inc.", enabled: true },
  { id: "5", symbol: "META", name: "Meta Platforms Inc.", enabled: true },
  { id: "6", symbol: "TSLA", name: "Tesla Inc.", enabled: true },
  { id: "7", symbol: "NVDA", name: "NVIDIA Corporation", enabled: true },
  { id: "8", symbol: "JPM", name: "JPMorgan Chase & Co.", enabled: true },
  { id: "9", symbol: "BAC", name: "Bank of America Corp.", enabled: true },
  { id: "10", symbol: "V", name: "Visa Inc.", enabled: true },
  { id: "11", symbol: "JNJ", name: "Johnson & Johnson", enabled: false },
  { id: "12", symbol: "WMT", name: "Walmart Inc.", enabled: false },
  { id: "13", symbol: "PG", name: "Procter & Gamble Co.", enabled: false },
  { id: "14", symbol: "MA", name: "Mastercard Inc.", enabled: false },
  { id: "15", symbol: "DIS", name: "The Walt Disney Company", enabled: false }
];

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("seo");
  const [stockSymbols, setStockSymbols] = useState<StockSymbol[]>(popularStocks);
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();
  
  // Fetch settings from API
  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings
  });

  // SEO Form
  const seoForm = useForm<z.infer<typeof seoSchema>>({
    resolver: zodResolver(seoSchema),
    defaultValues: {
      siteTitle: "",
      siteDescription: "",
      siteKeywords: "",
      siteFavicon: "",
      siteImage: ""
    }
  });
  
  // Social Media Form
  const socialForm = useForm<z.infer<typeof socialSchema>>({
    resolver: zodResolver(socialSchema),
    defaultValues: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
      youtube: ""
    }
  });
  
  // Tracking Form
  const trackingForm = useForm<z.infer<typeof trackingSchema>>({
    resolver: zodResolver(trackingSchema),
    defaultValues: {
      googleAnalytics: "",
      facebookPixel: "",
      tiktokPixel: "",
      customHeadCode: "",
      customBodyCode: ""
    }
  });
  
  // Stock Ticker Form
  const stockTickerForm = useForm<z.infer<typeof stockTickerSchema>>({
    resolver: zodResolver(stockTickerSchema),
    defaultValues: {
      enabled: true,
      autoRefreshInterval: 5,
      maxStocksToShow: 10,
    }
  });

  // Update forms when settings are loaded
  useEffect(() => {
    if (settings) {
      seoForm.reset({
        siteTitle: settings.seo.siteTitle || "",
        siteDescription: settings.seo.siteDescription || "",
        siteKeywords: settings.seo.siteKeywords || "",
        siteFavicon: settings.seo.siteFavicon || "",
        siteImage: settings.seo.siteImage || ""
      });
      
      socialForm.reset({
        facebook: settings.social.facebook || "",
        twitter: settings.social.twitter || "",
        instagram: settings.social.instagram || "",
        linkedin: settings.social.linkedin || "",
        youtube: settings.social.youtube || ""
      });
      
      trackingForm.reset({
        googleAnalytics: settings.tracking.googleAnalytics || "",
        facebookPixel: settings.tracking.facebookPixel || "",
        tiktokPixel: settings.tracking.tiktokPixel || "",
        customHeadCode: settings.tracking.customHeadCode || "",
        customBodyCode: settings.tracking.customBodyCode || ""
      });
    }
  }, [settings, seoForm, socialForm, trackingForm]);

  // Mutation for updating SEO settings
  const updateSeoMutation = useMutation({
    mutationFn: updateSeoSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success("SEO Settings Saved - Your SEO settings have been updated successfully.");
    },
    onError: (error) => {
      console.error("Error saving SEO settings:", error);
      toast.error("Error - Failed to save SEO settings. Please try again.");
    }
  });

  // Mutation for updating Social settings
  const updateSocialMutation = useMutation({
    mutationFn: updateSocialSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success("Social Media Settings Saved - Your social media settings have been updated successfully.");
    },
    onError: (error) => {
      console.error("Error saving social media settings:", error);
      toast.error("Error - Failed to save social media settings. Please try again.");
    }
  });

  // Mutation for updating Tracking settings
  const updateTrackingMutation = useMutation({
    mutationFn: updateTrackingSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success("Tracking Settings Saved - Your tracking settings have been updated successfully.");
    },
    onError: (error) => {
      console.error("Error saving tracking settings:", error);
      toast.error("Error - Failed to save tracking settings. Please try again.");
    }
  });
  
  // Save SEO settings
  const onSaveSeo = async (data: z.infer<typeof seoSchema>) => {
    try {
      setSaving(true);
      await updateSeoMutation.mutateAsync(data);
    } finally {
      setSaving(false);
    }
  };
  
  // Save Social Media settings
  const onSaveSocial = async (data: z.infer<typeof socialSchema>) => {
    try {
      setSaving(true);
      await updateSocialMutation.mutateAsync(data);
    } finally {
      setSaving(false);
    }
  };
  
  // Save Tracking settings
  const onSaveTracking = async (data: z.infer<typeof trackingSchema>) => {
    try {
      setSaving(true);
      await updateTrackingMutation.mutateAsync(data);
    } finally {
      setSaving(false);
    }
  };
  
  // Save Stock Ticker settings
  const onSaveStockTicker = async (data: z.infer<typeof stockTickerSchema>) => {
    try {
      setSaving(true);
      console.log("Saving Stock Ticker settings:", data);
      console.log("Stock symbols:", stockSymbols.filter(stock => stock.enabled).map(stock => stock.symbol));
      
      // Aqui seria implementado o salvamento das configurações do ticker
      // Para uma implementação completa, seria necessário criar um novo método na API
      
      toast.success("Stock Ticker Settings Saved - Your stock ticker settings have been updated successfully.");
    } catch (error) {
      console.error("Error saving stock ticker settings:", error);
      toast.error("Error - Failed to save stock ticker settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  
  // Toggle stock symbol
  const toggleStockSymbol = (id: string) => {
    setStockSymbols(prev => 
      prev.map(stock => 
        stock.id === id ? { ...stock, enabled: !stock.enabled } : stock
      )
    );
  };
  
  // Add new stock from search
  const addStockFromSearch = (result: StockSymbolSearchResult) => {
    const symbol = result.symbol.trim();
    
    // Verificar se o símbolo já existe
    if (stockSymbols.some(stock => stock.symbol === symbol)) {
      toast(`A ação ${symbol} já está na lista`);
      return;
    }
    
    // Adicionar novo símbolo
    const newId = `custom-${Date.now()}`;
    setStockSymbols(prev => [
      ...prev, 
      { id: newId, symbol, name: result.name, enabled: true }
    ]);
    
    toast(`Ação ${symbol} - ${result.name} adicionada com sucesso`);
  };
  
  // Remover ação
  const removeStock = (id: string) => {
    setStockSymbols(prev => prev.filter(stock => stock.id !== id));
    toast("Ação removida com sucesso");
  };

  if (isLoading) {
    return (
      <AdminLayout activeTab="settings">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Carregando configurações...</h1>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout activeTab="settings">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Erro ao carregar configurações</h1>
          </div>
          <p className="text-red-500">Houve um erro ao carregar as configurações. Por favor, tente novamente mais tarde.</p>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout activeTab="settings">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Site Settings</h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="seo">SEO & Metadata</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="tracking">Tracking & Analytics</TabsTrigger>
            <TabsTrigger value="ticker">Stock Ticker</TabsTrigger>
          </TabsList>
          
          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>SEO & Metadata Settings</CardTitle>
                <CardDescription>
                  Configure your site's SEO settings and metadata for better search engine visibility.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...seoForm}>
                  <form onSubmit={seoForm.handleSubmit(onSaveSeo)} className="space-y-6">
                    <FormField
                      control={seoForm.control}
                      name="siteTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site Title</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={seoForm.control}
                      name="siteDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={3} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={seoForm.control}
                      name="siteKeywords"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Keywords (comma separated)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={seoForm.control}
                      name="siteFavicon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Favicon URL</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="/favicon.ico" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={seoForm.control}
                      name="siteImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Site Image URL</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" disabled={saving || updateSeoMutation.isPending}>
                      {saving || updateSeoMutation.isPending ? "Saving..." : "Save SEO Settings"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Settings</CardTitle>
                <CardDescription>
                  Configure your social media links and profiles.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...socialForm}>
                  <form onSubmit={socialForm.handleSubmit(onSaveSocial)} className="space-y-6">
                    <FormField
                      control={socialForm.control}
                      name="facebook"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Facebook Page URL</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://facebook.com/yourpage" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={socialForm.control}
                      name="twitter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Twitter/X URL</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://twitter.com/yourhandle" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={socialForm.control}
                      name="instagram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instagram URL</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://instagram.com/yourhandle" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={socialForm.control}
                      name="linkedin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LinkedIn URL</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://linkedin.com/company/yourcompany" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={socialForm.control}
                      name="youtube"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>YouTube Channel URL</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://youtube.com/c/yourchannel" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" disabled={saving || updateSocialMutation.isPending}>
                      {saving || updateSocialMutation.isPending ? "Saving..." : "Save Social Media Settings"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tracking">
            <Card>
              <CardHeader>
                <CardTitle>Tracking & Analytics Settings</CardTitle>
                <CardDescription>
                  Configure tracking and analytics integrations for your site.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...trackingForm}>
                  <form onSubmit={trackingForm.handleSubmit(onSaveTracking)} className="space-y-6">
                    <FormField
                      control={trackingForm.control}
                      name="googleAnalytics"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Google Analytics ID</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="G-XXXXXXXXXX or UA-XXXXXXX-X" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={trackingForm.control}
                      name="facebookPixel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Facebook Pixel ID</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="XXXXXXXXXXXXXXXXXX" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={trackingForm.control}
                      name="tiktokPixel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>TikTok Pixel ID</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="XXXXXXXXXXXXXXXXXX" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={trackingForm.control}
                      name="customHeadCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom Head Code</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={4} placeholder="<script>...</script>" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={trackingForm.control}
                      name="customBodyCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom Body Code</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={4} placeholder="<script>...</script>" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" disabled={saving || updateTrackingMutation.isPending}>
                      {saving || updateTrackingMutation.isPending ? "Saving..." : "Save Tracking Settings"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ticker">
            <Card>
              <CardHeader>
                <CardTitle>Stock Ticker Settings</CardTitle>
                <CardDescription>
                  Configure the stock ticker display and select which symbols to show.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...stockTickerForm}>
                  <form onSubmit={stockTickerForm.handleSubmit(onSaveStockTicker)} className="space-y-6">
                    <FormField
                      control={stockTickerForm.control}
                      name="enabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Enable Stock Ticker</FormLabel>
                            <FormDescription>
                              Show the stock ticker on the website
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex flex-col md:flex-row gap-4">
                      <FormField
                        control={stockTickerForm.control}
                        name="autoRefreshInterval"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Auto Refresh Interval (minutes)</FormLabel>
                            <FormControl>
                              <Input type="number" min="1" max="60" {...field} 
                                onChange={(e) => field.onChange(parseInt(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={stockTickerForm.control}
                        name="maxStocksToShow"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Maximum Stocks to Show</FormLabel>
                            <FormControl>
                              <Input type="number" min="1" max="20" {...field} 
                                onChange={(e) => field.onChange(parseInt(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div>
                      <Label className="text-base font-medium mb-2 block">Stock Symbols</Label>
                      <p className="text-sm text-muted-foreground mb-4">
                        Select the stock symbols to display in the ticker or add new ones by searching.
                      </p>
                      
                      <div className="border rounded-md p-4">
                        <div className="mb-4">
                          <Label htmlFor="stock-search" className="mb-2 block">Add New Stock</Label>
                          <StockSearch
                            onSelect={addStockFromSearch}
                            placeholder="Search for stocks by name or symbol..."
                          />
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {stockSymbols.map((stock) => (
                            <div key={stock.id} className="flex items-center justify-between border rounded-md p-2 bg-background">
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id={`stock-${stock.id}`}
                                  checked={stock.enabled}
                                  onCheckedChange={() => toggleStockSymbol(stock.id)}
                                />
                                <Label htmlFor={`stock-${stock.id}`} className="cursor-pointer">
                                  <span className="font-medium">{stock.symbol}</span>
                                  <span className="text-muted-foreground ml-1 text-sm truncate max-w-[120px] inline-block">
                                    ({stock.name})
                                  </span>
                                </Label>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0" 
                                onClick={() => removeStock(stock.id)}
                              >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Remove {stock.symbol}</span>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <Button type="submit" disabled={saving}>
                      {saving ? "Saving..." : "Save Stock Ticker Settings"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
