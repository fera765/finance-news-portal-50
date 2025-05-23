
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getSettings } from "@/services/settingsService";
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch settings to get social media links
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simular o envio do formulário
    setTimeout(() => {
      toast.success("Mensagem enviada com sucesso", {
        description: "Entraremos em contato em breve."
      });
      
      // Limpar formulário
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setIsSubmitting(false);
    }, 1500);
  };
  
  // Function to render social media icon if URL exists
  const renderSocialIcon = (platform: string, url: string | undefined) => {
    if (!url) return null;
    
    const iconProps = {
      size: 24,
      className: "text-finance-700 hover:text-finance-900 transition-colors"
    };
    
    switch (platform) {
      case "facebook":
        return <a href={url} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex items-center gap-2"><Facebook {...iconProps} /><span>Facebook</span></a>;
      case "instagram":
        return <a href={url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex items-center gap-2"><Instagram {...iconProps} /><span>Instagram</span></a>;
      case "twitter":
        return <a href={url} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="flex items-center gap-2"><Twitter {...iconProps} /><span>Twitter</span></a>;
      case "linkedin":
        return <a href={url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex items-center gap-2"><Linkedin {...iconProps} /><span>LinkedIn</span></a>;
      case "youtube":
        return <a href={url} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="flex items-center gap-2"><Youtube {...iconProps} /><span>YouTube</span></a>;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Entre em Contato</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <p className="text-lg mb-6">
              Estamos sempre disponíveis para ouvir dúvidas, sugestões ou comentários. Preencha o formulário abaixo ou utilize um dos canais de contato listados.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome Completo *</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Digite seu nome" 
                  required 
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Digite seu email" 
                  required 
                />
              </div>
              
              <div>
                <Label htmlFor="subject">Assunto</Label>
                <Input 
                  id="subject" 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)} 
                  placeholder="Assunto da mensagem" 
                />
              </div>
              
              <div>
                <Label htmlFor="message">Mensagem *</Label>
                <Textarea 
                  id="message" 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  placeholder="Digite sua mensagem" 
                  rows={6} 
                  required 
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
              </Button>
            </form>
          </div>
          
          <div>
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Informações de Contato</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="text-finance-700 mt-1" size={20} />
                    <div>
                      <p className="font-medium">Email</p>
                      <a href="mailto:contato@financenews.com" className="text-finance-700 hover:underline">
                        contato@financenews.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Phone className="text-finance-700 mt-1" size={20} />
                    <div>
                      <p className="font-medium">Telefone</p>
                      <a href="tel:+551155551234" className="text-finance-700 hover:underline">
                        (11) 5555-1234
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="text-finance-700 mt-1" size={20} />
                    <div>
                      <p className="font-medium">Endereço</p>
                      <address className="not-italic">
                        Avenida Paulista, 1000<br />
                        Bela Vista, São Paulo - SP<br />
                        CEP 01310-100
                      </address>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {settings?.social && Object.values(settings.social).some(url => !!url) && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Redes Sociais</h2>
                  <div className="space-y-3">
                    {renderSocialIcon("facebook", settings.social.facebook)}
                    {renderSocialIcon("instagram", settings.social.instagram)}
                    {renderSocialIcon("twitter", settings.social.twitter)}
                    {renderSocialIcon("linkedin", settings.social.linkedin)}
                    {renderSocialIcon("youtube", settings.social.youtube)}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        <div className="mt-10 h-96 w-full">
          <h2 className="text-xl font-semibold mb-4">Nossa Localização</h2>
          <iframe
            title="Finance News Location"
            className="w-full h-full rounded-lg border border-gray-200"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.0976517998713!2d-46.65390548590906!3d-23.56143426766878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%20-%20Bela%20Vista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1653442254619!5m2!1spt-BR!2sbr"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
