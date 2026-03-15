"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { isPrototypeMode } from "@/lib/prototype";
import FarmerView from "@/components/dashboard/FarmerView";

export default function DashboardPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const { role, userId, fetchUserProfile, isHydrated, setRole } = useUserStore();

  // Temporary: Add role switcher for debugging
  useEffect(() => {
    if (isPrototypeMode && isHydrated && !role) {
      // Default to farmer for testing - change this to test different roles
      setRole('farmer');
    }
  }, [isPrototypeMode, isHydrated, role, setRole]);

  useEffect(() => {
    const redirectToRoleDashboard = async () => {
      if (!isHydrated) return;

      if (isPrototypeMode) {
        if (!userId) {
          router.push(`/${locale}/onboard/auth`);
          return;
        }
        if (role === "retailer") {
          router.replace(`/${locale}/dashboard/retailer`);
          return;
        } else if (role === "consumer") {
          router.replace(`/${locale}/dashboard/consumer`);
          return;
        }
        // Farmers stay on /dashboard (no redirect needed)
        return;
      }

      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push(`/${locale}/onboard/auth`);
        return;
      }
      if (!role) {
        await fetchUserProfile(session.user.id);
      }
      if (role === "retailer") {
        router.replace(`/${locale}/dashboard/retailer`);
        return;
      } else if (role === "consumer") {
        router.replace(`/${locale}/dashboard/consumer`);
        return;
      }
      // Farmers stay on /dashboard (no redirect needed)
    };

    redirectToRoleDashboard();
  }, [role, userId, isHydrated, router, locale, fetchUserProfile]);

  // Show loading state while checking/redirecting - prevent flash of wrong content
  if (!isHydrated || !role) {
    return (
      <div className="min-h-screen bg-[#faf6ee] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
          {isPrototypeMode && (
            <div className="mt-4 space-y-2">
              <p className="text-xs text-muted-foreground">Prototype Mode - Select Role:</p>
              <div className="flex gap-2 justify-center">
                <button 
                  onClick={() => setRole('farmer')}
                  className="px-3 py-1 bg-green-600 text-white text-xs rounded-full"
                >
                  Farmer
                </button>
                <button 
                  onClick={() => setRole('retailer')}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full"
                >
                  Retailer
                </button>
                <button 
                  onClick={() => setRole('consumer')}
                  className="px-3 py-1 bg-purple-600 text-white text-xs rounded-full"
                >
                  Consumer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // If user is not logged in, show login prompt
  if (!userId) {
    return (
      <div className="min-h-screen bg-[#faf6ee] flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please log in to continue</p>
          <button 
            onClick={() => router.push(`/${locale}/onboard/auth`)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-full"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Redirect non-farmers immediately - don't show any content
  if (role === "retailer") {
    router.replace(`/${locale}/dashboard/retailer`);
    return (
      <div className="min-h-screen bg-[#faf6ee] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting to retailer dashboard...</p>
        </div>
      </div>
    );
  }

  if (role === "consumer") {
    router.replace(`/${locale}/dashboard/consumer`);
    return (
      <div className="min-h-screen bg-[#faf6ee] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting to consumer dashboard...</p>
        </div>
      </div>
    );
  }

  // Show FarmerView for farmers only - DashboardShell provided by parent layout
  if (role === "farmer") {
    return <FarmerView />;
  }
}

