
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import { SidebarProvider } from "@/components/ui/sidebar";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Globe, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Linkedin, 
  Code, 
  ChevronRight 
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Define the schema for the SEO settings
const seoSchema = z.object({
  siteTitle: z.string().min(1, "O título do site é obrigatório"),
  siteDescription: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  siteKeywords: z.string(),
  siteFavicon: z.string().url("O favicon deve ser uma URL válida").or(z.literal("")),
  siteImage: z.string().url("A imagem deve ser uma URL válida").or(z.literal(""))
});

// Define the schema for the social media settings
const socialSchema = z.object({
  facebook: z.string().url("A URL do Facebook deve ser válida").or(z.literal("")),
  instagram: z.string().url("A URL do Instagram deve ser válida").or(z.literal("")),
  twitter: z.string().url("A URL do Twitter deve ser válida").or(z.literal("")),
  youtube: z.string().url("A URL do Youtube deve ser válida").or(z.literal("")),
  linkedin: z.string().url("A URL do LinkedIn deve ser válida").or(z.literal(""))
});

// Define the schema for the tracking settings
const trackingSchema = z.object({
  googleAnalytics: z.string(),
  facebookPixel: z.string(),
  tiktokPixel: z.string(),
  customHeadCode: z.string(),
  customBodyCode: z.string()
});

type SeoSettings = z.infer<typeof seoSchema>;
type SocialSettings = z.infer<typeof socialSchema>;
type TrackingSettings = z.infer<typeof trackingSchema>;

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("seo");
  const [isSaving, setIsSaving] = useState(false);

  // Initialize forms
  const seoForm = useForm<SeoSettings>({
    resolver: zodResolver(seoSchema),
    defaultValues: {
      siteTitle: "Finance News",
      siteDescription: "O melhor portal de notícias financeiras do Brasil",
      siteKeywords: "finanças, economia, investimentos, mercado de ações, bolsa de valores",
      siteFavicon: "",
      siteImage: ""
    }
  });

  const socialForm = useForm<SocialSettings>({
    resolver: zodResolver(socialSchema),
    defaultValues: {
      facebook: "https://facebook.com/financenews",
      instagram: "https://instagram.com/financenews",
      twitter: "https://twitter.com/financenews",
      youtube: "",
      linkedin: ""
    }
  });

  const trackingForm = useForm<TrackingSettings>({
    resolver: zodResolver(trackingSchema),
    defaultValues: {
      googleAnalytics: "",
      facebookPixel: "",
      tiktokPixel: "",
      customHeadCode: "",
      customBodyCode: ""
    }
  });

  const handleSeoSubmit = (data: SeoSettings) => {
    setIsSaving(true);
    setTimeout(() => {
      console.log("SEO settings saved:", data);
      toast.success("Configurações SEO salvas com sucesso!");
      setIsSaving(false);
    }, 700);
  };

  const handleSocialSubmit = (data: SocialSettings) => {
    setIsSaving(true);
    setTimeout(() => {
      console.log("Social settings saved:", data);
      toast.success("Configurações de redes sociais salvas com sucesso!");
      setIsSaving(false);
    }, 700);
  };

  const handleTrackingSubmit = (data: TrackingSettings) => {
    setIsSaving(true);
    setTimeout(() => {
      console.log("Tracking settings saved:", data);
      toast.success("Configurações de rastreamento salvas com sucesso!");
      setIsSaving(false);
    }, 700);
  };

  return (
    <SidebarProvider>
      <AdminLayout activeTab="settings">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold">Configurações</h1>
            <p className="text-gray-500 mt-1">Gerencie as configurações do seu site</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8 w-full max-w-md">
              <TabsTrigger value="seo">
                <Globe className="mr-2 h-4 w-4" />
                <span>SEO</span>
              </TabsTrigger>
              <TabsTrigger value="social">
                <Facebook className="mr-2 h-4 w-4" />
                <span>Redes Sociais</span>
              </TabsTrigger>
              <TabsTrigger value="tracking">
                <Code className="mr-2 h-4 w-4" />
                <span>Rastreamento</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="seo">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de SEO</CardTitle>
                  <CardDescription>
                    Gerencie as informações de SEO do seu site para melhorar o ranqueamento nos mecanismos de busca.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...seoForm}>
                    <form onSubmit={seoForm.handleSubmit(handleSeoSubmit)} className="space-y-6">
                      <FormField
                        control={seoForm.control}
                        name="siteTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Título do Site</FormLabel>
                            <FormControl>
                              <Input placeholder="Finance News" {...field} />
                            </FormControl>
                            <FormDescription>
                              Este título aparecerá na aba do navegador e nos resultados de busca.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={seoForm.control}
                        name="siteDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descrição do Site</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="O melhor portal de notícias financeiras do Brasil"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Uma descrição breve e atrativa do seu site para resultados de busca.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={seoForm.control}
                        name="siteKeywords"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Palavras-chave</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="finanças, economia, investimentos"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Palavras-chave separadas por vírgulas.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={seoForm.control}
                          name="siteFavicon"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Favicon URL</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://exemplo.com/favicon.ico"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                O ícone do seu site na aba do navegador.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={seoForm.control}
                          name="siteImage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Imagem de Compartilhamento</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://exemplo.com/imagem.jpg"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Imagem usada ao compartilhar o site nas redes sociais.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? "Salvando..." : "Salvar Configurações"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Redes Sociais</CardTitle>
                  <CardDescription>
                    Adicione links para suas redes sociais para aumentar sua presença online.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...socialForm}>
                    <form onSubmit={socialForm.handleSubmit(handleSocialSubmit)} className="space-y-6">
                      <FormField
                        control={socialForm.control}
                        name="facebook"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Facebook className="mr-2 h-4 w-4 text-blue-600" />
                              Facebook
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="https://facebook.com/sua-pagina" {...field} />
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
                            <FormLabel className="flex items-center">
                              <Instagram className="mr-2 h-4 w-4 text-pink-600" />
                              Instagram
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="https://instagram.com/seu-perfil" {...field} />
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
                            <FormLabel className="flex items-center">
                              <Twitter className="mr-2 h-4 w-4 text-sky-500" />
                              Twitter
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="https://twitter.com/seu-perfil" {...field} />
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
                            <FormLabel className="flex items-center">
                              <Youtube className="mr-2 h-4 w-4 text-red-600" />
                              YouTube
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="https://youtube.com/seu-canal" {...field} />
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
                            <FormLabel className="flex items-center">
                              <Linkedin className="mr-2 h-4 w-4 text-blue-700" />
                              LinkedIn
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="https://linkedin.com/company/sua-empresa" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? "Salvando..." : "Salvar Configurações"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tracking">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Rastreamento</CardTitle>
                  <CardDescription>
                    Configure integrações de análise e rastreamento para monitorar o desempenho do seu site.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...trackingForm}>
                    <form onSubmit={trackingForm.handleSubmit(handleTrackingSubmit)} className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Ferramentas de Análise</h3>
                        <Separator className="mb-4" />
                        
                        <FormField
                          control={trackingForm.control}
                          name="googleAnalytics"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ID do Google Analytics</FormLabel>
                              <FormControl>
                                <Input placeholder="G-XXXXXXXXXX" {...field} />
                              </FormControl>
                              <FormDescription>
                                Seu ID de rastreamento do Google Analytics (G-XXXXXXXXXX).
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-2">Pixels de Rastreamento</h3>
                        <Separator className="mb-4" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={trackingForm.control}
                            name="facebookPixel"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Facebook Pixel ID</FormLabel>
                                <FormControl>
                                  <Input placeholder="XXXXXXXXXXXXXXXXXX" {...field} />
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
                                  <Input placeholder="XXXXXXXXXXXXXXXXXX" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-2">Código Personalizado</h3>
                        <Separator className="mb-4" />
                        
                        <FormField
                          control={trackingForm.control}
                          name="customHeadCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Código para o &lt;head&gt;</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="<!-- Seu código HTML aqui -->"
                                  className="font-mono text-sm"
                                  rows={5}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Código personalizado que será inserido no &lt;head&gt; do seu site.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={trackingForm.control}
                          name="customBodyCode"
                          render={({ field }) => (
                            <FormItem className="mt-4">
                              <FormLabel>Código para o final do &lt;body&gt;</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="<!-- Seu código HTML aqui -->"
                                  className="font-mono text-sm"
                                  rows={5}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Código personalizado que será inserido antes do fechamento da tag &lt;body&gt;.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? "Salvando..." : "Salvar Configurações"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </AdminLayout>
    </SidebarProvider>
  );
};

export default SettingsPage;
