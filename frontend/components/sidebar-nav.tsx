"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  FileText,
  LayoutDashboard,
  LogOut,
  Train,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// The nav items remain the same
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
    title: "Admin Assistant",
    href: "/admin/chat",
    icon: User,
  },
  {
    title: "Tickets Log",
    href: "/admin/ticket",
    icon: FileText,
  },
];

export function SidebarNav() {
  const router = useRouter();
  const handleLogout = () => {
    router.push("/");
  };
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      // Reverted to default theme colors
      className="flex h-screen w-64 flex-col border-r bg-background"
    >
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Train className="h-5 w-5" />
        </div>
        <span className="text-lg font-semibold text-foreground">
          Train Monitor
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-muted text-foreground" // Simplified active state
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "absolute left-0 h-6 w-1 rounded-r-full bg-primary transition-all duration-200",
                  isActive ? "scale-y-100" : "scale-y-0 group-hover:scale-y-50"
                )}
              />
              <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "")} />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Footer - User Profile */}
      <div className="border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-muted" />
            <div className="flex-1 text-sm">
              <div className="font-medium text-foreground">Admin User</div>
              <div className="text-xs text-muted-foreground">
                admin@trainops.com
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-md transition-colors hover:bg-muted"
          >
            <LogOut className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </motion.aside>
  );
}