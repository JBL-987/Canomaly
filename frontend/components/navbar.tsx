"use client";

import Link from "next/link";
import DynamicBreadcrumb from "./dynamicbreadcrumb";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <nav className="flex justify-between border-b-4 border-b-white/10 items-center px-6 py-8 z-10">
      <h1 className="text-3xl font-bold">Canomaly</h1>

      {/* Breadcrumbs */}
      <DynamicBreadcrumb />

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
