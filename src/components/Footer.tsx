
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSettings } from "@/services/settingsService";
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();
  
  // Fetch settings to get social media links
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings
  });

  // Function to render social media icon if URL exists
  const renderSocialIcon = (platform: string, url: string | undefined) => {
    if (!url) return null;
    
    const iconProps = {
      size: 20,
      className: "hover:text-gold-400 transition-colors"
    };
    
    switch (platform) {
      case "facebook":
        return <a href={url} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook {...iconProps} /></a>;
      case "instagram":
        return <a href={url} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram {...iconProps} /></a>;
      case "twitter":
        return <a href={url} target="_blank" rel="noopener noreferrer" aria-label="Twitter"><Twitter {...iconProps} /></a>;
      case "linkedin":
        return <a href={url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin {...iconProps} /></a>;
      case "youtube":
        return <a href={url} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><Youtube {...iconProps} /></a>;
      default:
        return null;
    }
  };

  return (
    <footer className="bg-finance-900 py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="text-finance-50">Finance</span>
              <span className="text-gold-500">News</span>
            </h3>
            <p className="text-finance-200 text-sm">
              Sua fonte confiável para notícias financeiras, atualizações de mercado e análises econômicas.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-finance-50">Seções</h4>
            <ul className="space-y-2 text-finance-200">
              <li><Link to="/" className="hover:text-gold-400">Início</Link></li>
              <li><Link to="/markets" className="hover:text-gold-400">Mercados</Link></li>
              <li><Link to="/business" className="hover:text-gold-400">Negócios</Link></li>
              <li><Link to="/economy" className="hover:text-gold-400">Economia</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-finance-50">Empresa</h4>
            <ul className="space-y-2 text-finance-200">
              <li><Link to="/about" className="hover:text-gold-400">Sobre Nós</Link></li>
              <li><Link to="/contact" className="hover:text-gold-400">Contato</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-finance-50">Legal</h4>
            <ul className="space-y-2 text-finance-200">
              <li><Link to="/terms" className="hover:text-gold-400">Termos de Serviço</Link></li>
              <li><Link to="/privacy" className="hover:text-gold-400">Política de Privacidade</Link></li>
              <li><Link to="/cookies" className="hover:text-gold-400">Política de Cookies</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-finance-800 mt-8 pt-8 text-sm text-finance-300 flex flex-col md:flex-row justify-between">
          <p>© {year} Finance News. Todos os direitos reservados.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {settings?.social && (
              <>
                {renderSocialIcon("twitter", settings.social.twitter)}
                {renderSocialIcon("linkedin", settings.social.linkedin)}
                {renderSocialIcon("facebook", settings.social.facebook)}
                {renderSocialIcon("instagram", settings.social.instagram)}
                {renderSocialIcon("youtube", settings.social.youtube)}
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
