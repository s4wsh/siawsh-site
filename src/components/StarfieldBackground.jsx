import React, { useEffect, useRef, useState } from 'react';

export default function StarfieldBackground() {
  const canvasRef = useRef(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [showPermissionBtn, setShowPermissionBtn] = useState(false);

  useEffect(() => {
    // Check if browser requires permission request for DeviceOrientation (iOS 13+)
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      setShowPermissionBtn(true);
    } else {
      // Android / standard desktop
      setPermissionGranted(true);
    }
  }, []);

  const requestGyroPermission = async () => {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      try {
        const response = await DeviceOrientationEvent.requestPermission();
        if (response === 'granted') {
          setPermissionGranted(true);
          setShowPermissionBtn(false);
        }
      } catch (error) {
        console.error('Gyroscope permission denied:', error);
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Generate balanced star particles
    const starCount = Math.floor((width * height) / 4000);
    const stars = Array.from({ length: starCount }, () => ({
      x: (Math.random() - 0.5) * width * 1.8,
      y: (Math.random() - 0.5) * height * 1.8,
      size: Math.random() * 1.6 + 0.4,
      alpha: Math.random() * 0.8 + 0.2,
      twinkleSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() < 0.5 ? 1 : -1),
    }));

    let targetAngle = 0;
    let currentAngle = 0;

    // Device orientation handler
    const handleOrientation = (event) => {
      if (event.gamma !== null && event.gamma !== undefined) {
        // gamma represents left-to-right tilt [-90, 90]
        const rad = (event.gamma * Math.PI) / 180;
        targetAngle = -rad; // Counter-rotate to stay balanced with horizon
      }
    };

    if (permissionGranted) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Animation & render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth interpolation (lerp) for smooth motion tracking
      currentAngle += (targetAngle - currentAngle) * 0.1;

      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate(currentAngle);

      stars.forEach((star) => {
        // Twinkle effect
        star.alpha += star.twinkleSpeed;
        if (star.alpha >= 1 || star.alpha <= 0.2) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [permissionGranted]);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-black">
      <canvas ref={canvasRef} className="block w-full h-full opacity-80" />

      {/* iOS Safari Permission Button */}
      {showPermissionBtn && !permissionGranted && (
        <button
          type="button"
          onClick={requestGyroPermission}
          className="pointer-events-auto absolute bottom-6 right-6 text-[10px] tracking-widest font-mono border border-neutral-800 bg-neutral-950/80 hover:bg-neutral-900 text-neutral-400 hover:text-white px-3 py-1.5 rounded-full backdrop-blur-md transition-all uppercase"
        >
          Enable Motion Sensor
        </button>
      )}
    </div>
  );
}