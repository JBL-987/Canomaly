"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import DynamicBreadcrumb from "./dynamicbreadcrumb";
import { Button } from "./ui/button";

export default function Navbar() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav className="flex justify-between items-center border-b-4 border-b-white/10 px-6 py-6 bg-white z-10">
      {/* Logo / App Name */}
      <h1 className="text-3xl font-bold text-black">Canomaly</h1>

      {/* Breadcrumbs */}
      <div className="mx-6">
        <DynamicBreadcrumb />
      </div>

      {/* Sign In / Sign Up Buttons */}
      <div className="flex gap-2">
        <Button asChild size="sm" variant="outline">
          <Link href="/auth/login">Sign In</Link>
        </Button>
        <Button asChild size="sm" variant="default">
          <Link href="/auth/sign-up">Sign Up</Link>
        </Button>
      </div>
    </nav>
  );
}
