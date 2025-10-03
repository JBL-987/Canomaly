"use client";

import { motion } from "framer-motion";
import Image from "next/image";
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
      transition={{ duration: 0.3, ease: "easeInOut" }}
      // Sticky position with glassmorphism effect
      className="sticky top-0 w-full bg-background/80 backdrop-blur-lg border-b border-border/60 shadow-sm z-50"
    >
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo / App Name */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/canomaly_logo.svg"
            alt="Canomaly Logo"
            width={50}
            height={50}
          />
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
          <Link href="/auth/login">
            <Button size="sm" variant="ghost">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/sign-up">
            <Button size="sm" variant="default" className="shadow-md">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
