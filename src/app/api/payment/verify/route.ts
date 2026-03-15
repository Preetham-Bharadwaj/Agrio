import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = await request.json();

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Update payment record in database
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        order_id: orderId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        amount: 0, // Will be updated from order
        status: 'success',
      });

    if (paymentError) throw paymentError;

    // Update order status
    const { error: orderError } = await supabase
      .from('orders')
      .update({ payment_status: 'completed' })
      .eq('id', orderId);

    if (orderError) throw orderError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
