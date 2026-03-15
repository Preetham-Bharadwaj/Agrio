"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useParams, useRouter } from "next/navigation";
import { 
  Home, 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  FileText,
  Menu,
  X,
  LogOut,
  Hammer,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/store/useUserStore";

interface RetailerLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  {
    name: "Home",
    href: "/dashboard/retailer",
    icon: Home,
    description: "Quick stats & live auctions"
  },
  {
    name: "Auctions",
    href: "/dashboard/retailer/auctions",
    icon: Hammer,
    description: "Live, upcoming & won auctions"
  },
  {
    name: "Browse Listings",
    href: "/dashboard/retailer/listings",
    icon: Search,
    description: "Direct buy from farmers"
  },
  {
    name: "Analytics",
    href: "/dashboard/retailer/analytics",
    icon: BarChart3,
    description: "Price trends & forecasts"
  },
  {
    name: "Orders",
    href: "/dashboard/retailer/orders",
    icon: Package,
    description: "Active & past purchases"
  }
];

export default function RetailerLayout({ children }: RetailerLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { locale } = useParams();
  const router = useRouter();
  const { reset } = useUserStore();

  const isActive = (href: string) => {
    if (href === "/dashboard/retailer") {
      return pathname === `/${locale}/dashboard/retailer`;
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
            <h1 className="text-xl font-serif text-primary">Retailer Hub</h1>
            <p className="text-xs text-foreground/60">Procurement Platform</p>
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
              <h1 className="text-2xl font-serif text-primary mb-1">Retailer Hub</h1>
              <p className="text-xs text-foreground/60 font-bold uppercase tracking-widest">Procurement Platform</p>
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
                    {item.name === "Auctions" && (
                      <Badge className="bg-red-500 text-white text-xs px-2 py-0.5">LIVE</Badge>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Quick Stats */}
            <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10">
              <h3 className="font-medium text-primary mb-3">This Month</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/60">Spent</span>
                  <span className="font-medium">₹12.4L</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/60">Volume</span>
                  <span className="font-medium">284 Tons</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/60">Saved</span>
                  <span className="font-medium text-green-600">₹2.1L</span>
                </div>
              </div>
            </div>

            {/* Role badge */}
            <div className="mt-8 p-4 bg-muted/50 rounded-xl border border-muted">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">
                Logged in as
              </p>
              <p className="font-semibold text-primary text-center capitalize">Retailer</p>
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
                <h1 className="text-xl font-serif text-primary mb-1">Retailer Hub</h1>
                <p className="text-xs text-foreground/60 font-bold uppercase tracking-widest">Procurement Platform</p>
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
                      {item.name === "Auctions" && (
                        <Badge className="bg-red-500 text-white text-xs px-2 py-0.5">LIVE</Badge>
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
                <p className="font-semibold text-primary text-center capitalize">Retailer</p>
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
