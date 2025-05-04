import { useState, useEffect } from 'react';

export function useIsMobile() {
  // Set initial state based on window width if available
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    // Default to true for mobile-first approach
    return true;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Add event listener
    window.addEventListener('resize', checkMobile);
    
    // Initial check
    checkMobile();

    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}
