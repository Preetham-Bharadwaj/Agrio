"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useParams, useRouter } from "next/navigation";
import { 
  Home, 
  ShoppingBag, 
  ShoppingCart, 
  Package, 
  MessageSquare,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/store/useUserStore";

interface ConsumerLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  {
    name: "Home",
    href: "/dashboard/consumer",
    icon: Home,
    description: "Personalized shopping"
  },
  {
    name: "Shop",
    href: "/dashboard/consumer/shop",
    icon: ShoppingBag,
    description: "Browse products"
  },
  {
    name: "Cart",
    href: "/dashboard/consumer/cart",
    icon: ShoppingCart,
    description: "Your items"
  },
  {
    name: "Orders",
    href: "/dashboard/consumer/orders",
    icon: Package,
    description: "Track deliveries"
  },
  {
    name: "Help",
    href: "/dashboard/consumer/support",
    icon: MessageSquare,
    description: "Get support"
  }
];

export default function ConsumerLayout({ children }: ConsumerLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { locale } = useParams();
  const router = useRouter();
  const { reset } = useUserStore();

  const isActive = (href: string) => {
    if (href === "/dashboard/consumer") {
      return pathname === `/${locale}/dashboard/consumer`;
    }
    return pathname.includes(href);
  };

  const handleLogout = () => {
    // Clear user data from store
    reset();
    
    // Redirect to sign-in page
    router.push(`/${locale}/auth/signin`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-muted sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-serif text-primary">Consumer Hub</h1>
            <p className="text-xs text-foreground/60">Fresh Marketplace</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block w-64 bg-white border-r border-muted min-h-screen sticky top-0">
          <div className="p-6">
            <div className="mb-8">
              <h1 className="text-2xl font-serif text-primary mb-1">Consumer Hub</h1>
              <p className="text-xs text-foreground/60 font-bold uppercase tracking-widest">Fresh Marketplace</p>
            </div>

            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link
                    key={item.name}
                    href={`/${locale}${item.href}`}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs opacity-70">{item.description}</p>
                    </div>
                    {item.name === "Cart" && (
                      <Badge className="bg-red-500 text-white text-xs px-2 py-0.5">3</Badge>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Role badge */}
            <div className="mt-8 p-4 bg-muted/50 rounded-xl border border-muted">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">
                Logged in as
              </p>
              <p className="font-semibold text-primary text-center capitalize">Consumer</p>
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
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="bg-white w-64 h-full p-6" onClick={(e) => e.stopPropagation()}>
              <div className="mb-8">
                <h1 className="text-xl font-serif text-primary mb-1">Consumer Hub</h1>
                <p className="text-xs text-foreground/60 font-bold uppercase tracking-widest">Fresh Marketplace</p>
              </div>

              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  
                  return (
                    <Link
                      key={item.name}
                      href={`/${locale}${item.href}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        active
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs opacity-70">{item.description}</p>
                      </div>
                      {item.name === "Cart" && (
                        <Badge className="bg-red-500 text-white text-xs px-2 py-0.5">3</Badge>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Role badge for mobile */}
              <div className="mt-8 p-4 bg-muted/50 rounded-xl border border-muted">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">
                  Logged in as
                </p>
                <p className="font-semibold text-primary text-center capitalize">Consumer</p>
              </div>

              {/* Logout Button for mobile */}
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full justify-start text-muted-foreground hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-xl"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Logout
              </Button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <main className="p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
