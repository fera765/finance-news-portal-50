
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackSiteView } from '@/services/viewsService';

export function useSiteViews() {
  const location = useLocation();

  // Rastrear uma visualização do site quando a localização muda
  useEffect(() => {
    const trackView = async () => {
      try {
        await trackSiteView();
        console.log('Visualização do site registrada');
      } catch (error) {
        console.error('Falha ao registrar visualização do site:', error);
      }
    };

    // Adicionar um pequeno atraso para evitar rastreamento durante transições de página
    const timeoutId = setTimeout(() => {
      trackView();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [location.pathname]);

  return null;
}
