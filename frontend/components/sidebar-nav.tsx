"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle, FileText, LayoutDashboard, Train } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    title: "Dashboard",
    href: "/admin/homepage",
    icon: LayoutDashboard,
  },
  {
    title: "Anomaly Detection",
    href: "/admin/anomaly",
    icon: AlertTriangle,
  },
  {
    title: "Tickets Log",
    href: "/admin/ticket",
    icon: FileText,
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <Train className="h-6 w-6 text-sidebar-primary" />
        <span className="text-lg font-semibold text-sidebar-foreground">
          Train Monitor
        </span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/30 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-sidebar-primary" />
          <div className="flex-1 text-sm">
            <div className="font-medium text-sidebar-foreground">
              Admin User
            </div>
            <div className="text-xs text-sidebar-foreground/60">
              admin@trainops.com
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
