"use client";

import Link from "next/link";
import { usePathname, useParams, useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { getNavForRole } from "@/lib/dashboard-nav";
import { cn } from "@/lib/utils";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const pathname = usePathname();
  const { locale } = useParams();
  const router = useRouter();
  const role = useUserStore((state) => state.role) ?? "farmer";
  const { reset } = useUserStore();
  const navItems = getNavForRole(role);

  const handleLogout = () => {
    // Clear user data from store
    reset();
    
    // Redirect to sign-in page
    router.push(`/${locale}/auth/signin`);
  };

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col w-64 min-h-screen flex-shrink-0",
        "bg-white border-r border-muted/60 shadow-sm",
        "fixed left-0 top-0 z-40"
      )}
    >
      {/* Logo / Brand */}
      <div className="p-6 border-b border-muted/60">
        <Link href={`/${locale}/dashboard`} className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <span className="font-serif font-bold text-lg">A</span>
          </div>
          <div>
            <span className="font-serif font-bold text-primary text-lg">Agrio</span>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {role === "farmer" ? "Farmer Hub" : role === "retailer" ? "Procurement" : "Marketplace"}
            </p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const href = `/${locale}${item.href}`;
          const isActive =
            pathname === href ||
            (item.href === "/dashboard" && (pathname === href || /\/dashboard\/(farmer|retailer|consumer)$/.test(pathname))) ||
            (item.href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={item.href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              <item.icon
                className={cn("w-5 h-5 flex-shrink-0", isActive && "stroke-[2.5px]")}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section with Logout */}
      <div className="p-4 border-t border-muted/60 space-y-3">
        {/* Role badge */}
        <div className="rounded-xl bg-muted/50 px-4 py-2 text-center">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Logged in as
          </p>
          <p className="font-semibold text-primary capitalize">{role}</p>
        </div>
        
        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start text-muted-foreground hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-xl"
        >
          <LogOut className="w-4 h-4 mr-3" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
