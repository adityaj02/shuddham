const { Resend } = require('resend');

const resend = new Resend('re_W1Q71mBM_7ntySJwvfhDJgmKnbGixyJ1z');

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
