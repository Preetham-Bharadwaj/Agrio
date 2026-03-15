import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export async function POST(request: NextRequest) {
  try {
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
      { error: error.message },
      { status: 500 }
    );
  }
}
