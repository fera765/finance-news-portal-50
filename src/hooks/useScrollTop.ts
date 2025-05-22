
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant' // Use 'instant' instead of 'smooth' to avoid visual issues
    });
  }, [pathname]);
}
