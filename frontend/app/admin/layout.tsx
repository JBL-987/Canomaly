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

<<<<<<< HEAD
export default function RootLayout({
=======
export default function AdminLayout({
>>>>>>> 181ad786d3ed78c96f0f356ae1666e6e494bb63a
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<<<<<<< HEAD
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
=======
    <div lang="en">
      <div className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
>>>>>>> 181ad786d3ed78c96f0f356ae1666e6e494bb63a
        <div className="flex h-screen">
          <Suspense fallback={<div>Loading...</div>}>
            <SidebarNav />
          </Suspense>
          <div className="flex-1 overflow-hidden">{children}</div>
        </div>
        <Analytics />
<<<<<<< HEAD
      </body>
    </html>
=======
      </div>
    </div>
>>>>>>> 181ad786d3ed78c96f0f356ae1666e6e494bb63a
  );
}
