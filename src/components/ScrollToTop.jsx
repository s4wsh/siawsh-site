import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Instantly reset scroll to the top of the page on route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Uses instant jump so content doesn't flicker while scrolling
    });
  }, [pathname]);

  return null;
}