"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Don't wrap sub-routes (retailer, consumer) with DashboardShell
  // They have their own layouts
  if (pathname?.includes('/dashboard/retailer') || pathname?.includes('/dashboard/consumer')) {
    return children;
  }
  
  // Only wrap the main dashboard route
  return <DashboardShell>{children}</DashboardShell>;
}
