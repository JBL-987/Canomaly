'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function VantaBg() {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).VANTA) {
      (window as any).VANTA.WAVES({
        el: "#vanta-bg",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x20f1b,
        shininess: 92.00,
        waveHeight: 15.50
      });
    }
  }, []);

  return (
    <>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js" strategy="beforeInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.waves.min.js" strategy="beforeInteractive" />
      <div id="vanta-bg" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}></div>
    </>
  );
}
