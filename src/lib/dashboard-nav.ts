import {
  Home,
  TrendingUp,
  PlusCircle,
  Hammer,
  Landmark,
  MessageSquare,
  Truck,
  ShoppingBasket,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  icon: LucideIcon;
  href: string;
  primary?: boolean;
};

export const farmerNav: NavItem[] = [
  { label: "Home", icon: Home, href: "/dashboard" },
  { label: "Sell", icon: PlusCircle, href: "/dashboard/sell", primary: true },
  { label: "Auction", icon: Hammer, href: "/dashboard/auction" },
  { label: "Market Rates", icon: TrendingUp, href: "/dashboard/prices" },
  { label: "Schemes", icon: Landmark, href: "/dashboard/schemes" },
  { label: "Sarkari Saathi", icon: MessageSquare, href: "/dashboard/chat" },
];

export const retailerNav: NavItem[] = [
  { label: "Home", icon: Home, href: "/dashboard" },
  { label: "Auction", icon: Hammer, href: "/dashboard/auction" },
  { label: "Buy", icon: PlusCircle, href: "/dashboard/buy", primary: true },
  { label: "Stats", icon: TrendingUp, href: "/dashboard/analytics" },
  { label: "Orders", icon: Truck, href: "/dashboard/orders" },
];

export const consumerNav: NavItem[] = [
  { label: "Home", icon: Home, href: "/dashboard" },
  { label: "Browse", icon: ShoppingBasket, href: "/dashboard/consumer/browse" },
  { label: "Cart", icon: PlusCircle, href: "/dashboard/consumer/cart", primary: true },
  { label: "Orders", icon: Truck, href: "/dashboard/consumer/orders" },
  { label: "Support", icon: MessageSquare, href: "/dashboard/consumer/support" },
];

export function getNavForRole(role: "farmer" | "retailer" | "consumer"): NavItem[] {
  return role === "retailer" ? retailerNav : role === "consumer" ? consumerNav : farmerNav;
}
