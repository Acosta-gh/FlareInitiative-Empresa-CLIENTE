import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const ALLOWED_ORIGINS = ['https://flareinitiative.org', 'http://localhost:3000'];

const from = process.env.EMAIL_FROM || 'The Flare Initiative <onboarding@resend.dev>';
const to = process.env.EMAIL_TO || 'info@flareinitiative.org';

function notificationHtml(name: string, email: string, message: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Fira Sans', Arial, sans-serif; line-height: 1.6; color: #181818; margin: 0; padding: 0; background: #f8f7f5; }
    .container { max-width: 560px; margin: 0 auto; }
    .header { background: #181818; padding: 36px 28px; text-align: center; }
    .header h1 { margin: 0; font-size: 22px; color: #ffffff; font-weight: 700; letter-spacing: 1px; }
    .header .tagline { color: #FAB571; font-size: 13px; margin-top: 6px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; }
    .content { background: #ffffff; padding: 36px 28px; }
    .field { margin-bottom: 24px; }
    .field-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; color: #415b8a; display: block; margin-bottom: 6px; }
    .field-value { font-size: 15px; color: #181818; padding: 8px 0; border-bottom: 1px solid rgba(24,24,24,0.08); }
    .field-value a { color: #415b8a; text-decoration: underline; }
    .footer { background: #181818; padding: 24px 28px; text-align: center; }
    .footer p { color: rgba(255,255,255,0.5); font-size: 12px; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>THE FLARE INITIATIVE</h1>
      <p class="tagline">New Contact Form Submission</p>
    </div>
    <div class="content">
      <div class="field">
        <span class="field-label">Name</span>
        <div class="field-value">${name}</div>
      </div>
      <div class="field">
        <span class="field-label">Email</span>
        <div class="field-value"><a href="mailto:${email}">${email}</a></div>
      </div>
      <div class="field">
        <span class="field-label">Message</span>
        <div class="field-value" style="white-space:pre-wrap;">${message}</div>
      </div>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} The Flare Initiative. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}

function autoReplyHtml(name: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Fira Sans', Arial, sans-serif; line-height: 1.6; color: #181818; margin: 0; padding: 0; background: #f8f7f5; }
    .container { max-width: 560px; margin: 0 auto; }
    .header { background: #181818; padding: 36px 28px; text-align: center; }
    .header h1 { margin: 0; font-size: 22px; color: #ffffff; font-weight: 700; letter-spacing: 1px; }
    .header .tagline { color: #FAB571; font-size: 13px; margin-top: 6px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; }
    .content { background: #ffffff; padding: 36px 28px; }
    .content p { font-size: 15px; margin: 0 0 16px; color: #333; }
    .content .signoff { margin-top: 28px; padding-top: 20px; border-top: 1px solid rgba(24,24,24,0.08); }
    .content .signoff p { margin: 0; }
    .footer { background: #181818; padding: 24px 28px; text-align: center; }
    .footer p { color: rgba(255,255,255,0.5); font-size: 12px; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>THE FLARE INITIATIVE</h1>
      <p class="tagline">We Received Your Message</p>
    </div>
    <div class="content">
      <p>Hi ${name},</p>
      <p>Thank you for reaching out to <strong>The Flare Initiative</strong>. We have received your message and will get back to you as soon as possible.</p>
      <p>Your inquiry is important to us. If you have any urgent matters, please don't hesitate to reach out to us directly at <a href="mailto:${to}" style="color:#415b8a;">${to}</a>.</p>
      <p>In the meantime, you can learn more about our mission and work on our <a href="https://flareinitiative.org" style="color:#415b8a;">website</a>.</p>
      <div class="signoff">
        <p>Warm regards,</p>
        <p><strong>The Flare Initiative Team</strong></p>
      </div>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} The Flare Initiative. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(request: Request) {
  try {
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (referer && !ALLOWED_ORIGINS.some((o) => referer.startsWith(o))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await request.json();

    if (data.website) {
      return NextResponse.json({ error: 'Spam detected' }, { status: 400 });
    }

    const name = (data.name || '').trim().slice(0, 100);
    const email = (data.email || '').trim().slice(0, 320);
    const message = (data.message || '').trim().slice(0, 5000);

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is missing');
      return NextResponse.json(
        { error: 'Email service configuration error' },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const [{ error: notifError }, { error: autoError }] = await Promise.all([
      resend.emails.send({
        from,
        to,
        subject: `New message from ${name} - The Flare Initiative`,
        replyTo: email,
        html: notificationHtml(name, email, message),
      }),
      resend.emails.send({
        from,
        to: email,
        subject: 'Thank you for contacting The Flare Initiative',
        html: autoReplyHtml(name),
      }),
    ]);

    if (notifError) {
      console.error('Resend notification error:', notifError);
      return NextResponse.json(
        { error: 'Failed to send notification' },
        { status: 500 }
      );
    }

    if (autoError) {
      console.error('Resend auto-reply error:', autoError);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
