export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { name, email, message, company, website, elapsedMs } = payload;

    // Honeypot: silently accept likely bot submissions.
    if (company || website) {
      return res.status(200).json({ ok: true });
    }

    // Time-based bot guard: submissions completed unrealistically fast are likely automated.
    const elapsed = Number(elapsedMs);
    if (Number.isFinite(elapsed) && elapsed > 0 && elapsed < 1500) {
      return res.status(200).json({ ok: true });
    }

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL;
    const fromEmail = process.env.CONTACT_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>';

    if (!resendApiKey || !toEmail) {
      return res.status(500).json({
        error: 'Email service is not configured',
        details: 'Missing RESEND_API_KEY or CONTACT_TO_EMAIL in Vercel environment variables.',
      });
    }

    const sendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: `New portfolio contact from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      }),
    });

    if (!sendRes.ok) {
      const errorText = await sendRes.text();
      return res.status(502).json({
        error: 'Failed to send email',
        details: errorText,
      });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return res.status(500).json({
      error: 'Unexpected server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
