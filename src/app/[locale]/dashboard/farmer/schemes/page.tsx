'use client';

import { useRouter, useParams } from 'next/navigation';
import { SchemesDiscovery } from '@/components/farmer/SchemesDiscovery';
import { useUserStore } from '@/store/useUserStore';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SchemesPage() {
  const router = useRouter();
  const { locale } = useParams();
  const { userId, district, state } = useUserStore();

  if (!userId || !district || !state) {
    return (
      <div className="min-h-screen bg-[#faf6ee] flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf6ee] p-6 pb-24">
      <div className="max-w-md mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <h1 className="text-3xl font-serif text-primary mb-6">Government Schemes</h1>

        <SchemesDiscovery
          userId={userId}
          state={state}
          district={district}
        />
      </div>
    </div>
  );
}
