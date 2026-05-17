import { Resend } from 'resend';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'SHUDDHAM Orders <onboarding@resend.dev>',
      to: ['adityajmarch020304@gmail.com'],
      subject: 'Test Email Verification',
      html: '<p>If you are receiving this, your Resend API is working!</p>'
    });

    if (error) {
      console.error('Error sending:', error);
    } else {
      console.log('Success!', data);
    }
  } catch (e) {
    console.error('Exception:', e);
  }
}

testEmail();
