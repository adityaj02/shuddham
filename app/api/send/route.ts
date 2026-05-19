import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { env, hasResendEnv } from '@/lib/env';

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export async function GET() {
  if (!resend) {
    return NextResponse.json({ error: "Resend API key is not configured in environment variables." }, { status: 500 });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'SHUDDHAM Orders <onboarding@resend.dev>',
      to: ['delivered@resend.dev'], // Safe testing email provided by Resend
      subject: 'Test Email Verification',
      html: '<p>If you are receiving this, your Resend API is working perfectly!</p>'
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to send email" }, { status: 500 });
  }
}
