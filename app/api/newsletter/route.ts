import { NextRequest, NextResponse } from 'next/server';

import { deliverOfficialMail } from '@/app/lib/mailer';

export async function POST(request: NextRequest) {
  try {
    const { email } = (await request.json()) as { email?: string };
    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const internalDelivery = await deliverOfficialMail({
      to: process.env.MAIL_TO_SUPPORT || 'support@lokus.store',
      subject: 'New LOKUS newsletter signup',
      replyTo: email,
      text: `Newsletter signup received from ${email}.`,
      html: `<p>Newsletter signup received from <strong>${email}</strong>.</p>`,
    });

    const subscriberDelivery = await deliverOfficialMail({
      to: email,
      subject: 'You are on the LOKUS list',
      text: 'Thanks for joining the LOKUS list. You will hear from us about new drops, notes, and launch alerts.',
      html: `
        <p>Thanks for joining the <strong>LOKUS</strong> list.</p>
        <p>You will hear from us about new drops, notes, and launch alerts.</p>
      `,
    });

    const previewMode = internalDelivery.mode === 'preview' || subscriberDelivery.mode === 'preview';

    return NextResponse.json({
      success: true,
      mode: previewMode ? 'preview' : 'smtp',
      message: previewMode
        ? 'Newsletter flow is working locally. Official mail sending will start after SMTP is connected.'
        : 'You are on the LOKUS list.',
    });
  } catch (error) {
    console.error('Newsletter mail error:', error);
    return NextResponse.json({ error: 'Unable to join the list right now. Please try again in a moment.' }, { status: 500 });
  }
}
