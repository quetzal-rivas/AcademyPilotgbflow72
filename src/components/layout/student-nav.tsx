
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Camera, Zap, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export function StudentNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: Home, label: "BASE" },
    { href: "/student/dashboard", icon: LayoutDashboard, label: "UNIT DATA" },
    { href: "/student/scan", icon: Camera, label: "SCANNER" },
  ];

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-card border-4 border-border shadow-2xl px-8 py-4 flex items-center gap-12 rounded-none">
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary px-4 py-0.5 border-2 border-border">
        <p className="text-[8px] font-black text-white uppercase tracking-[0.3em]">Operational Link</p>
      </div>
      
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 transition-all group",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className={cn(
              "h-6 w-6 transition-transform group-hover:scale-110",
              isActive && "drop-shadow-[0_0_8px_rgba(225,29,72,0.5)]"
            )} />
            <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
