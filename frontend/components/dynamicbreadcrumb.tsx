"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SlashIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const steps: { href: string; label: string }[] = [
  { href: "/user/homepage", label: "Home" },
  { href: "/user/train-list", label: "Train List" },
  { href: "/user/your-booking", label: "Your Booking" },
];

export default function DynamicBreadcrumb() {
  const pathname = usePathname() ?? "/";
  if (pathname?.startsWith("/")) return null;

  const currentIndex = steps.findIndex(
    (s) => pathname === s.href || pathname.startsWith(s.href + "/")
  );

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {steps.map((step, i) => {
          const isFuture = i > currentIndex;
          const isActive = i === currentIndex;

          return (
            <React.Fragment key={step.href}>
              {i > 0 && (
                <BreadcrumbSeparator>
                  <SlashIcon />
                </BreadcrumbSeparator>
              )}

              <BreadcrumbItem>
                {isFuture ? (
                  // Future step - light gray, not clickable
                  <span className="text-gray-400 select-none cursor-not-allowed">
                    {step.label}
                  </span>
                ) : (
                  // Past or Active steps - black, clickable
                  <BreadcrumbLink asChild>
                    <Link
                      href={step.href}
                      className={`${
                        isActive
                          ? "font-bold text-black"
                          : "font-bold text-black"
                      } hover:underline`}
                    >
                      {step.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
