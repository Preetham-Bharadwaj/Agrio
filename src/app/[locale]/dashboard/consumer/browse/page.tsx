'use client';

import { useRouter, useParams } from 'next/navigation';
import { ProduceBrowser } from '@/components/consumer/ProduceBrowser';
import { useUserStore } from '@/store/useUserStore';
import { supabase } from '@/lib/supabase';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BrowsePage() {
  const router = useRouter();
  const { locale } = useParams();
  const { userId } = useUserStore();

  const handleAddToCart = async (listingId: string, quantity: number) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: userId,
          listing_id: listingId,
          quantity_kg: quantity,
        });

      if (error) throw error;

      // Show success message
      alert('Added to cart!');
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

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

        <h1 className="text-3xl font-serif text-primary mb-6">Browse Produce</h1>

        <ProduceBrowser onAddToCart={handleAddToCart} />
      </div>
    </div>
  );
}
