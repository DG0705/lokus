import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

// Prevent static generation of this API route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  // Check if environment variables are present
  if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error("Missing Razorpay environment variables");
    return NextResponse.json(
      { error: "Payment service not configured" },
      { status: 500 }
    );
  }

  const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    const { amount, currency = "INR" } = await request.json();

    if (!amount) {
      return NextResponse.json(
        { error: "Amount is required" },
        { status: 400 }
      );
    }

    const options = {
      amount: amount * 100, // Convert to paise (e.g., ₹129 = 12900 paise)
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    console.log("Order created:", order.id);

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}