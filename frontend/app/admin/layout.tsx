import "@/app/globals.css";
import { SidebarNav } from "@/components/sidebar-nav";
import { Analytics } from "@vercel/analytics/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import type React from "react";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Train Anomaly Detection Dashboard",
  description: "Admin dashboard for monitoring train ticket anomalies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <div className="flex h-screen">
          <Suspense fallback={<div>Loading...</div>}>
            <SidebarNav />
          </Suspense>
          <div className="flex-1 overflow-hidden">{children}</div>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
