"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#faf6ee]/50">
      <Sidebar />
      {/* Main content: offset by sidebar on desktop, full width on mobile */}
      <main className="md:pl-64 min-h-screen">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-8 pb-24 md:pb-8">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
