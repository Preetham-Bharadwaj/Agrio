'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';

interface OrderTrackerProps {
  userId: string;
}

interface Order {
  id: string;
  buyer_id: string;
  seller_id: string;
  listing_id: string;
  quantity_kg: number;
  price_per_kg: number;
  total_amount: number;
  payment_status: string;
  delivery_status: 'placed' | 'packed' | 'dispatched' | 'delivered';
  estimated_delivery_date: string | null;
  created_at: string;
  listing?: {
    crop: string;
    photo_url: string | null;
  };
  seller?: {
    name: string;
    district: string;
  };
}

export function OrderTracker({ userId }: OrderTrackerProps) {
  const t = useTranslations('consumer');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const fetchOrders = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select(`
          *,
          listing:listings!listing_id (
            crop,
            photo_url
          ),
          seller:users!seller_id (
            name,
            district
          )
        `)
        .eq('buyer_id', userId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setOrders(data || []);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'placed':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'packed':
        return <Package className="w-5 h-5 text-orange-600" />;
      case 'dispatched':
        return <Truck className="w-5 h-5 text-purple-600" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'packed':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'dispatched':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusSteps = (currentStatus: string) => {
    const steps = ['placed', 'packed', 'dispatched', 'delivered'];
    const currentIndex = steps.indexOf(currentStatus);
    
    return steps.map((step, index) => ({
      step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.delivery_status === filter);

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t('yourOrders')}</h3>
        <span className="text-sm text-muted-foreground">
          {orders.length} {t('orders')}
        </span>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'placed', 'packed', 'dispatched', 'delivered'].map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(status)}
          >
            {t(status)}
          </Button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <Card className="p-8 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-muted-foreground">{t('noOrders')}</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex gap-4 mb-4">
                {order.listing?.photo_url ? (
                  <img
                    src={order.listing.photo_url}
                    alt={order.listing.crop}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-3xl">
                    🌾
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-lg">{order.listing?.crop}</h4>
                      <p className="text-sm text-muted-foreground">
                        {t('orderId')}: {order.id.slice(0, 8)}...
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={getStatusColor(order.delivery_status)}
                    >
                      {getStatusIcon(order.delivery_status)}
                      <span className="ml-1">{t(order.delivery_status)}</span>
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{order.seller?.name} • {order.seller?.district}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span>{order.quantity_kg} kg × ₹{order.price_per_kg}</span>
                    <span className="font-bold text-primary">
                      ₹{order.total_amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="relative pt-4 border-t">
                <div className="flex justify-between">
                  {getStatusSteps(order.delivery_status).map((step, index) => (
                    <div key={step.step} className="flex flex-col items-center flex-1">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.completed
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Clock className="w-5 h-5" />
                        )}
                      </div>
                      <p className="text-xs mt-1 text-center">{t(step.step)}</p>
                    </div>
                  ))}
                </div>
                <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-200 -z-10">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${
                        (getStatusSteps(order.delivery_status).filter((s) => s.completed)
                          .length -
                          1) *
                        33.33
                      }%`,
                    }}
                  />
                </div>
              </div>

              {order.estimated_delivery_date && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
                  <p className="text-blue-900">
                    {t('estimatedDelivery')}: {formatDate(order.estimated_delivery_date)}
                  </p>
                </div>
              )}

              <div className="mt-4 text-xs text-muted-foreground">
                {t('orderedOn')}: {formatDate(order.created_at)}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
