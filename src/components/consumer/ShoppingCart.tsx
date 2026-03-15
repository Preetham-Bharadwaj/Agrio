'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';

interface ShoppingCartProps {
  userId: string;
  onCheckout: (items: CartItem[]) => void;
}

interface CartItem {
  id: string;
  listing_id: string;
  quantity: number;
  created_at: string;
  listing?: {
    id: string;
    crop: string;
    min_price: number;
    health_grade: string;
    photo_url: string | null;
    farmer_id: string;
    farmer?: {
      name: string;
      account_type: string;
    };
  };
}

export function ShoppingCart({ userId, onCheckout }: ShoppingCartProps) {
  const t = useTranslations('consumer');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCartItems();
  }, [userId]);

  const fetchCartItems = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('cart_items')
        .select(`
          *,
          listing:listings!listing_id (
            id,
            crop,
            min_price,
            health_grade,
            photo_url,
            farmer_id,
            farmer:users!farmer_id (
              name,
              account_type
            )
          )
        `)
        .eq('user_id', userId);

      if (fetchError) throw fetchError;

      setCartItems(data || []);
    } catch (err: any) {
      console.error('Error fetching cart:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity_kg: newQuantity })
        .eq('id', itemId);

      if (updateError) throw updateError;

      await fetchCartItems();
    } catch (err: any) {
      console.error('Error updating quantity:', err);
      setError(err.message);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (deleteError) throw deleteError;

      await fetchCartItems();
    } catch (err: any) {
      console.error('Error removing item:', err);
      setError(err.message);
    }
  };

  const groupBySeller = () => {
    const grouped: Record<string, CartItem[]> = {};
    
    cartItems.forEach((item) => {
      const sellerId = item.listing?.farmer_id || 'unknown';
      if (!grouped[sellerId]) {
        grouped[sellerId] = [];
      }
      grouped[sellerId].push(item);
    });

    return grouped;
  };

  const calculateSellerTotal = (items: CartItem[]) => {
    return items.reduce((total, item) => {
      return total + (item.listing?.min_price || 0) * item.quantity;
    }, 0);
  };

  const calculateGrandTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.listing?.min_price || 0) * item.quantity;
    }, 0);
  };

  const handleCheckout = () => {
    onCheckout(cartItems);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-600 bg-red-50 rounded-md">
        {error}
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Card className="p-8 text-center">
        <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">{t('emptyCart')}</h3>
        <p className="text-sm text-muted-foreground">{t('emptyCartDesc')}</p>
      </Card>
    );
  }

  const groupedItems = groupBySeller();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t('yourCart')}</h3>
        <span className="text-sm text-muted-foreground">
          {cartItems.length} {t('items')}
        </span>
      </div>

      {/* Grouped by Seller */}
      {Object.entries(groupedItems).map(([sellerId, items]) => {
        const sellerName = items[0]?.listing?.farmer?.name || t('unknownSeller');
        const sellerType = items[0]?.listing?.farmer?.account_type || 'farmer';
        const sellerTotal = calculateSellerTotal(items);

        return (
          <Card key={sellerId} className="p-4">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b">
              <span className="text-lg">
                {sellerType === 'farmer' ? '🌾' : '🏪'}
              </span>
              <div>
                <p className="font-semibold">{sellerName}</p>
                <p className="text-xs text-muted-foreground">
                  {sellerType === 'farmer' ? t('farmer') : t('retailer')}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  {item.listing?.photo_url ? (
                    <img
                      src={item.listing.photo_url}
                      alt={item.listing.crop}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                      🌾
                    </div>
                  )}

                  <div className="flex-1">
                    <h4 className="font-semibold">{item.listing?.crop}</h4>
                    <p className="text-sm text-muted-foreground">
                      ₹{item.listing?.min_price}/kg
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-12 text-center font-semibold">
                        {item.quantity} kg
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 ml-auto text-red-600"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-primary">
                      ₹{((item.listing?.min_price || 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t flex justify-between items-center">
              <span className="font-semibold">{t('sellerTotal')}:</span>
              <span className="text-lg font-bold text-primary">
                ₹{sellerTotal.toFixed(2)}
              </span>
            </div>
          </Card>
        );
      })}

      {/* Grand Total and Checkout */}
      <Card className="p-6 bg-primary/5">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">{t('grandTotal')}:</span>
          <span className="text-2xl font-bold text-primary">
            ₹{calculateGrandTotal().toFixed(2)}
          </span>
        </div>

        <Button
          onClick={handleCheckout}
          className="w-full"
          size="lg"
        >
          {t('proceedToCheckout')}
        </Button>

        <p className="text-xs text-center text-muted-foreground mt-3">
          {t('separateOrdersNote')}
        </p>
      </Card>
    </div>
  );
}
