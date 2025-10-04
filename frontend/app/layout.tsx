import Navbar from "@/components/navbar";
<<<<<<< HEAD
import { ThemeProvider } from "next-themes";
=======
>>>>>>> 181ad786d3ed78c96f0f356ae1666e6e494bb63a
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata = {
  title: "Canomaly",
  description: "Your train booking app",
  icons: {
    icon: "/canomaly_logo.svg", 
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
<<<<<<< HEAD
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main style={{ position: "relative", zIndex: 1 }}>{children}</main>
        </ThemeProvider>
=======
        <Navbar />
        <main style={{ position: "relative", zIndex: 1 }}>{children}</main>
>>>>>>> 181ad786d3ed78c96f0f356ae1666e6e494bb63a
      </body>
    </html>
  );
}
