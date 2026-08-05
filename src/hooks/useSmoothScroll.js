import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

export default function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.8,          // Higher duration = slower, smoother scroll stop (Default is ~1.2)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth exponential ease-out
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.7,   // Lower multiplier = slower scroll movement per wheel notch (Default is 1.0)
      touchMultiplier: 1.2,   // Slower response for touchpads/mobile
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
}