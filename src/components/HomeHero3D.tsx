"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useVideoTexture } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useMemo, useState } from "react";
import Collectibles from "@/components/Collectibles";

function VideoBillboard() {
  // Pick best format dynamically (WebM when supported, else MP4)
  const src = useMemo(() => {
    if (typeof document !== "undefined") {
      const v = document.createElement("video");
      const canWebm = v.canPlayType("video/webm; codecs=vp9") || v.canPlayType("video/webm");
      if (canWebm) return "/media/hero/hero-loop.webm";
    }
    return "/media/hero/hero-loop.mp4";
  }, []);

  const texture = useVideoTexture(src, {
    start: true,
    loop: true,
    muted: true,
    crossOrigin: "Anonymous",
  });

  // Slight anisotropy for crispness
  if (texture instanceof THREE.VideoTexture) {
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 2;
  }

  // Determine actual video aspect once metadata is available; fallback to 16:9.
  const [videoAspect, setVideoAspect] = useState(16 / 9);
  useEffect(() => {
    const img = texture?.image as HTMLVideoElement | undefined;
    if (!img) return;
    const update = () => {
      if (img.videoWidth && img.videoHeight) {
        setVideoAspect(img.videoWidth / img.videoHeight);
      }
    };
    if (img.readyState >= 1) update();
    img.addEventListener("loadedmetadata", update, { once: true });
    return () => img.removeEventListener("loadedmetadata", update);
  }, [texture]);

  // Responsive fit: contain on small screens, cover otherwise
  const contain = true; // Always preserve full video without cropping across all breakpoints

  // Fit the plane using camera projection math
  const { camera, size } = useThree();
  let vw = 1, vh = 1;
  if ((camera as THREE.Camera).type === 'PerspectiveCamera') {
    const cam = camera as THREE.PerspectiveCamera;
    const distance = Math.abs(cam.position.z - 0); // plane at z=0
    const vFov = (cam.fov * Math.PI) / 180;
    vh = 2 * Math.tan(vFov / 2) * distance;
    vw = vh * cam.aspect;
  } else {
    // Orthographic fallback: derive from viewport pixels
    vw = size.width / 100; // arbitrary scale; will still compute cover below
    vh = size.height / 100;
  }
  let w: number, h: number;
  if (contain) {
    // object-fit: contain
    w = vw;
    h = w / videoAspect;
    if (h > vh) {
      h = vh;
      w = vh * videoAspect;
    }
  } else {
    // object-fit: cover
    w = vw;
    h = w / videoAspect;
    if (h < vh) {
      h = vh;
      w = vh * videoAspect;
    }
  }

  return (
    <group position={[0, 0, 0]}>
      <mesh scale={[w, h, 1]}>
        <planeGeometry args={[1, 1, 1, 1]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function HomeHero3D() {
  // Feature flag: show collectibles only if explicitly enabled
  const showCollectibles =
    process.env.NEXT_PUBLIC_SHOW_COLLECTIBLES === "1" ||
    process.env.NEXT_PUBLIC_SHOW_COLLECTIBLES === "true";
  return (
    <section className="relative mt-0 overflow-hidden bg-transparent md:px-0 md:pt-0 px-[4vw] pt-[4vw]">
      {/* 3D scene */}
      <div className="h-[72vh] min-h-[420px] md:h-[72vh] sm:h-[64vh]">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.75]}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[4, 6, 5]} intensity={1.0} />
          <VideoBillboard />
        </Canvas>
      </div>
      {/* Collectibles overlay (playful but minimal) */}
      {showCollectibles ? <Collectibles /> : null}
      {/* Drop-shadow fade under hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent via-black/35 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-6 w-[72%] h-8 rounded-full bg-black/45 blur-2xl opacity-60"
      />
    </section>
  );
}
