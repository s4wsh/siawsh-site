import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

// Export singleton instance globally for route changes and click handlers
export let lenisInstance = null;

export default function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.075, // Slightly softer interpolation for smoother response
      smoothWheel: true,
      wheelMultiplier: 0.8075, // Decreased scroll sensitivity by exactly 5% (0.85 -> 0.8075)
      touchMultiplier: 1.14, // Adjusted touch sensitivity accordingly (-5%)
      infinite: false,
    });

    lenisInstance = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const animationId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationId);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
}