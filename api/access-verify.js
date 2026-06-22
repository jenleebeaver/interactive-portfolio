import { verifyAccessToken } from './_lib/access-token.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.query || {};
  const tokenSecret = process.env.ACCESS_TOKEN_SECRET;

  if (!tokenSecret) {
    return res.status(500).json({ valid: false, error: 'Missing ACCESS_TOKEN_SECRET' });
  }

  const verification = verifyAccessToken(token, tokenSecret);
  if (!verification.valid) {
    return res.status(200).json({ valid: false, reason: verification.reason });
  }

  return res.status(200).json({
    valid: true,
    assetKeys: verification.payload.assetKeys || [],
    email: verification.payload.email || null,
    exp: verification.payload.exp,
  });
}
