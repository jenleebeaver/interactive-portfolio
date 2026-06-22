import { createAccessToken } from './_lib/access-token.js';

function getSiteBaseUrl(req) {
  if (process.env.PUBLIC_SITE_URL) {
    return process.env.PUBLIC_SITE_URL.replace(/\/$/, '');
  }
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  return `${proto}://${host}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const {
      projectId,
      assetId,
      assetLabel,
      requesterName,
      requesterEmail,
      requesterMessage,
    } = payload;

    if (!projectId || !assetId || !assetLabel || !requesterName || !requesterEmail) {
      return res.status(400).json({ error: 'Missing required request fields' });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL;
    const fromEmail = process.env.CONTACT_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>';
    const tokenSecret = process.env.ACCESS_TOKEN_SECRET;

    if (!resendApiKey || !toEmail || !tokenSecret) {
      return res.status(500).json({
        error: 'Access request service is not configured',
        details: 'Missing RESEND_API_KEY, CONTACT_TO_EMAIL, or ACCESS_TOKEN_SECRET.',
      });
    }

    const assetKey = `${projectId}:${assetId}`;
    const token = createAccessToken(
      {
        email: requesterEmail,
        assetKeys: [assetKey],
        exp: Date.now() + 1000 * 60 * 60 * 24 * 14, // 14 days
      },
      tokenSecret
    );

    const baseUrl = getSiteBaseUrl(req);
    const grantUrl = `${baseUrl}/?access_token=${encodeURIComponent(token)}#case-study-${projectId}`;

    const textBody = [
      'New restricted-asset access request',
      '',
      `Asset: ${assetLabel}`,
      `Asset Key: ${assetKey}`,
      `Requester Name: ${requesterName}`,
      `Requester Email: ${requesterEmail}`,
      requesterMessage ? `Requester Message: ${requesterMessage}` : null,
      '',
      'To grant access, share this secure link with the requester:',
      grantUrl,
      '',
      'Note: Link expires in 14 days and unlocks only the specified asset.',
    ].filter(Boolean).join('\n');

    const sendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: requesterEmail,
        subject: `Access request: ${assetLabel} (${requesterName})`,
        text: textBody,
      }),
    });

    if (!sendRes.ok) {
      const errorText = await sendRes.text();
      return res.status(502).json({ error: 'Failed to send access request email', details: errorText });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({
      error: 'Unexpected server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
