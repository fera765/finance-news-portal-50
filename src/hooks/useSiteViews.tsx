
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackSiteView } from '@/services/viewsService';

export function useSiteViews() {
  const location = useLocation();

  // Track a site view when location changes
  useEffect(() => {
    const trackView = async () => {
      try {
        await trackSiteView();
        console.log('Site view tracked');
      } catch (error) {
        console.error('Failed to track site view:', error);
      }
    };

    // Add a small delay to avoid tracking during page transitions
    const timeoutId = setTimeout(() => {
      trackView();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [location.pathname]);

  return null;
}
