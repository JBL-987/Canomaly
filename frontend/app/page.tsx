"use client";

import dynamic from "next/dynamic";

// Dynamically import VantaBg to prevent SSR errors
const VantaBg = dynamic(() => import("@/components/vanta-bg"), { ssr: false });

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Vanta Background */}
      <VantaBg />

      {/* Main content */}
      <main className="relative z-10 container mx-auto max-w-4xl mt-8">
        this is landing page
      </main>
    </div>
  );
}
