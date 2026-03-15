'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { CreditCard, Smartphone, Building } from 'lucide-react';

interface RazorpayCheckoutProps {
  orderId: string;
  amount: number;
  onPaymentSuccess: (paymentId: string) => void;
  onPaymentFailure: (error: string) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function RazorpayCheckout({
  orderId,
  amount,
  onPaymentSuccess,
  onPaymentFailure,
}: RazorpayCheckoutProps) {
  const t = useTranslations('consumer');
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Load Razorpay SDK
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!scriptLoaded) {
      onPaymentFailure(t('razorpayNotLoaded'));
      return;
    }

    setLoading(true);

    try {
      // Create Razorpay order via API
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount * 100, // Convert to paise
          orderId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment order');
      }

      const { razorpayOrderId, key } = await response.json();

      // Initialize Razorpay
      const options = {
        key: key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: 'INR',
        name: 'Agrio',
        description: `Order #${orderId}`,
        order_id: razorpayOrderId,
        handler: async function (response: any) {
          // Verify payment
          const verifyResponse = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId,
            }),
          });

          if (verifyResponse.ok) {
            onPaymentSuccess(response.razorpay_payment_id);
          } else {
            onPaymentFailure(t('paymentVerificationFailed'));
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#10b981',
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            onPaymentFailure(t('paymentCancelled'));
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Payment error:', error);
      onPaymentFailure(error.message || t('paymentFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{t('paymentMethod')}</h3>

      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3 p-3 border rounded-lg">
          <Smartphone className="w-5 h-5 text-primary" />
          <div>
            <p className="font-semibold text-sm">{t('upi')}</p>
            <p className="text-xs text-muted-foreground">{t('upiDesc')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 border rounded-lg">
          <CreditCard className="w-5 h-5 text-primary" />
          <div>
            <p className="font-semibold text-sm">{t('cardPayment')}</p>
            <p className="text-xs text-muted-foreground">{t('cardDesc')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 border rounded-lg">
          <Building className="w-5 h-5 text-primary" />
          <div>
            <p className="font-semibold text-sm">{t('netBanking')}</p>
            <p className="text-xs text-muted-foreground">{t('netBankingDesc')}</p>
          </div>
        </div>
      </div>

      <div className="bg-primary/5 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <span className="font-semibold">{t('totalAmount')}:</span>
          <span className="text-2xl font-bold text-primary">₹{amount.toFixed(2)}</span>
        </div>
      </div>

      <Button
        onClick={handlePayment}
        disabled={loading || !scriptLoaded}
        className="w-full"
        size="lg"
      >
        {loading ? t('processing') : t('payNow')}
      </Button>

      <p className="text-xs text-center text-muted-foreground mt-4">
        {t('securePayment')}
      </p>
    </Card>
  );
}
