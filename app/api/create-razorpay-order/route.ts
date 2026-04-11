import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

import { createClient as createUserClient } from '@/utils/supabase/server';
import { hasServiceRoleAccess } from '@/utils/supabase/admin';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json({ error: 'Payment service not configured' }, { status: 500 });
  }

  const supabase = await createUserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!hasServiceRoleAccess() && !user) {
    return NextResponse.json(
      {
        error:
          'Guest checkout is not enabled yet. Add SUPABASE_SERVICE_ROLE_KEY on the server or sign in before payment.',
      },
      { status: 503 }
    );
  }

  const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    const { amount, currency = 'INR', receipt } = (await request.json()) as {
      amount?: number;
      currency?: string;
      receipt?: string;
    };

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    });

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
