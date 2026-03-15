import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: NextRequest) {
  try {
    // Check if Razorpay is configured
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { error: 'Payment service not configured. This is a demo environment.' },
        { status: 503 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { amount, orderId } = await request.json();

    const options = {
      amount: amount, // amount in paise
      currency: 'INR',
      receipt: orderId,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      razorpayOrderId: order.id,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Payment service unavailable in demo mode' },
      { status: 503 }
    );
  }
}
