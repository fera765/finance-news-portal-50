import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
  ogTitle: z.string(),
  ogDescription: z.string(),
  ogImage: z.string()
});

const socialSchema = z.object({
  facebook: z.string().url().or(z.literal("")),
  twitter: z.string().url().or(z.literal("")),
  instagram: z.string().url().or(z.literal("")),
  linkedin: z.string().url().or(z.literal("")),
  youtube: z.string().url().or(z.literal(""))
});

const trackingSchema = z.object({
  googleAnalyticsId: z.string().regex(/^UA-\d{7}-\d+$|^G-[A-Z0-9]+$/).or(z.literal("")),
  facebookPixelId: z.string().regex(/^\d+$/).or(z.literal("")),
  tiktokPixelId: z.string().regex(/^\d+$/).or(z.literal("")),
});

const stockTickerSchema = z.object({
  enabled: z.boolean(),
  autoRefreshInterval: z.number().min(1).max(60),
  maxStocksToShow: z.number().min(1).max(20),
});

// Mock initial data
const initialSeoData = {
  siteTitle: "Finance News - Latest Financial Updates & Market Analysis",
  siteDescription: "Stay informed with the latest financial news, market analysis, and expert insights on our comprehensive finance news platform.",
  siteKeywords: "finance news, financial markets, stock market, investments, economy, business news",
  ogTitle: "Finance News - Market Updates & Financial Analysis",
  ogDescription: "Breaking financial news and in-depth market analysis from industry experts.",
  ogImage: "https://example.com/images/finance-news-og.jpg"
};

const initialSocialData = {
  facebook: "https://facebook.com/financenews",
  twitter: "https://twitter.com/financenews",
  instagram: "https://instagram.com/financenews",
  linkedin: "https://linkedin.com/company/financenews",
  youtube: "https://youtube.com/financenews"
};

const initialTrackingData = {
  googleAnalyticsId: "G-ABC123456",
  facebookPixelId: "123456789",
  tiktokPixelId: "987654321"
};

const initialStockTickerData = {
  enabled: true,
  autoRefreshInterval: 5,
  maxStocksToShow: 10,
};

// Popular stock symbols for selection
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
  const [newSymbol, setNewSymbol] = useState("");
  const [saving, setSaving] = useState(false);
  
  // SEO Form
  const seoForm = useForm<z.infer<typeof seoSchema>>({
    resolver: zodResolver(seoSchema),
    defaultValues: initialSeoData
  });
  
  // Social Media Form
  const socialForm = useForm<z.infer<typeof socialSchema>>({
    resolver: zodResolver(socialSchema),
    defaultValues: initialSocialData
  });
  
  // Tracking Form
  const trackingForm = useForm<z.infer<typeof trackingSchema>>({
    resolver: zodResolver(trackingSchema),
    defaultValues: initialTrackingData
  });
  
  // Stock Ticker Form
  const stockTickerForm = useForm<z.infer<typeof stockTickerSchema>>({
    resolver: zodResolver(stockTickerSchema),
    defaultValues: initialStockTickerData
  });
  
  // Save SEO settings
  const onSaveSeo = async (data: z.infer<typeof seoSchema>) => {
    try {
      setSaving(true);
      // In a real app, this would be an API call
      console.log("Saving SEO settings:", data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "SEO Settings Saved",
        description: "Your SEO settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving SEO settings:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save SEO settings. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Save Social Media settings
  const onSaveSocial = async (data: z.infer<typeof socialSchema>) => {
    try {
      setSaving(true);
      // In a real app, this would be an API call
      console.log("Saving Social Media settings:", data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Social Media Settings Saved",
        description: "Your social media settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving social media settings:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save social media settings. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Save Tracking settings
  const onSaveTracking = async (data: z.infer<typeof trackingSchema>) => {
    try {
      setSaving(true);
      // In a real app, this would be an API call
      console.log("Saving Tracking settings:", data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Tracking Settings Saved",
        description: "Your tracking settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving tracking settings:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save tracking settings. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Save Stock Ticker settings
  const onSaveStockTicker = async (data: z.infer<typeof stockTickerSchema>) => {
    try {
      setSaving(true);
      // In a real app, this would be an API call
      console.log("Saving Stock Ticker settings:", data);
      console.log("Stock symbols:", stockSymbols.filter(stock => stock.enabled).map(stock => stock.symbol));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Stock Ticker Settings Saved",
        description: "Your stock ticker settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving stock ticker settings:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save stock ticker settings. Please try again.",
      });
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
  
  // Add new stock symbol
  const addNewSymbol = () => {
    if (!newSymbol) return;
    
    const symbol = newSymbol.trim().toUpperCase();
    
    // Check if symbol already exists
    if (stockSymbols.some(stock => stock.symbol === symbol)) {
      toast({
        variant: "destructive",
        title: "Duplicate Symbol",
        description: `The symbol "${symbol}" is already in the list.`,
      });
      return;
    }
    
    // Add new symbol
    const newId = `custom-${Date.now()}`;
    setStockSymbols(prev => [
      ...prev, 
      { id: newId, symbol, name: symbol, enabled: true }
    ]);
    
    setNewSymbol("");
    
    toast({
      title: "Symbol Added",
      description: `Added "${symbol}" to the stock ticker.`,
    });
  };
  
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
                    
                    <Separator className="my-4" />
                    <h3 className="text-lg font-medium mb-4">Open Graph Settings</h3>
                    
                    <FormField
                      control={seoForm.control}
                      name="ogTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>OG Title</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={seoForm.control}
                      name="ogDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>OG Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={2} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={seoForm.control}
                      name="ogImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>OG Image URL</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" disabled={saving}>
                      {saving ? "Saving..." : "Save SEO Settings"}
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
                    
                    <Button type="submit" disabled={saving}>
                      {saving ? "Saving..." : "Save Social Media Settings"}
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
                      name="googleAnalyticsId"
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
                      name="facebookPixelId"
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
                      name="tiktokPixelId"
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
                    
                    <Button type="submit" disabled={saving}>
                      {saving ? "Saving..." : "Save Tracking Settings"}
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
                            <CardDescription>
                              Show the stock ticker on the website
                            </CardDescription>
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
                        Select the stock symbols to display in the ticker.
                      </p>
                      
                      <div className="border rounded-md p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {stockSymbols.map((stock) => (
                            <div key={stock.id} className="flex items-center space-x-2">
                              <Switch
                                id={`stock-${stock.id}`}
                                checked={stock.enabled}
                                onCheckedChange={() => toggleStockSymbol(stock.id)}
                              />
                              <Label htmlFor={`stock-${stock.id}`} className="font-medium">
                                {stock.symbol}
                                <span className="text-muted-foreground ml-1 text-sm">
                                  ({stock.name})
                                </span>
                              </Label>
                            </div>
                          ))}
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div className="flex items-center space-x-2">
                          <Input
                            placeholder="Add new symbol (e.g. AAPL)"
                            value={newSymbol}
                            onChange={(e) => setNewSymbol(e.target.value)}
                            className="flex-1"
                          />
                          <Button type="button" onClick={addNewSymbol} disabled={!newSymbol}>Add</Button>
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
