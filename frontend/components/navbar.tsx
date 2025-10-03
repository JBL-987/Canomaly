"use client";

import { motion } from "framer-motion";
import { Box } from "lucide-react"; // A nice icon for the logo
import Link from "next/link";
import { usePathname } from "next/navigation";
import DynamicBreadcrumb from "./dynamicbreadcrumb";
import { Button } from "./ui/button";

export default function Navbar() {
  const pathname = usePathname();

  // Hide navbar on admin routes
  if (pathname?.startsWith("/admin")) return null;

  return (
    <motion.nav
      // Animation for a smooth fade-in on page load
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      // Sticky position with glassmorphism effect
      className="sticky top-0 w-full bg-background/80 backdrop-blur-lg border-b border-border/60 shadow-sm z-50"
    >
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo / App Name */}
        <Link href="/" className="flex items-center gap-2">
          <Box className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-sky-400 bg-clip-text text-transparent">
            Canomaly
          </h1>
        </Link>

        {/* Breadcrumbs - Centered and hidden on smaller screens */}
        <div className="hidden md:block">
          <DynamicBreadcrumb />
        </div>

        {/* Sign In / Sign Up Buttons */}
        <div className="flex gap-2">
          <Button asChild size="sm" variant="ghost">
            <Link href="/auth/login">Sign In</Link>
          </Button>
          <Button asChild size="sm" variant="default" className="shadow-md">
            <Link href="/auth/sign-up">Sign Up</Link>
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}
