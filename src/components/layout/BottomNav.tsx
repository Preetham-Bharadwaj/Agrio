"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { getNavForRole } from "@/lib/dashboard-nav";

export function BottomNav() {
  const pathname = usePathname();
  const { locale } = useParams();
  const role = useUserStore((state) => state.role) ?? "farmer";
  const navItems = getNavForRole(role);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white/90 backdrop-blur-xl border-t border-muted px-4 py-3 flex justify-between items-center rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const itemHref = `/${locale}${item.href}`;
        const isActive = pathname === itemHref;

        if (item.primary) {
          return (
            <Link key={item.href} href={itemHref} className="relative -top-8">
              <div className="w-16 h-16 bg-primary rounded-3xl shadow-2xl shadow-primary/30 flex items-center justify-center text-background rotate-12 transition-transform hover:rotate-0 active:scale-90">
                <item.icon className="w-8 h-8 -rotate-12" />
              </div>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary uppercase tracking-widest whitespace-nowrap">
                {item.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={itemHref}
            className={`flex flex-col items-center gap-1.5 transition-all active:scale-90 ${isActive ? "text-primary" : "text-primary/30 hover:text-primary/60"}`}
          >
            <item.icon
              className={`w-5 h-5 ${isActive ? "stroke-[2.5px]" : "stroke-2"}`}
            />
            <span
              className={`text-[9px] font-bold uppercase tracking-wider ${isActive ? "opacity-100" : "opacity-60"}`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
