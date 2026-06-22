import crypto from 'crypto';

function toBase64Url(value) {
  return Buffer.from(value).toString('base64url');
}

function fromBase64Url(value) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function signPayload(payloadPart, secret) {
  return crypto.createHmac('sha256', secret).update(payloadPart).digest('base64url');
}

export function createAccessToken(payload, secret) {
  const payloadPart = toBase64Url(JSON.stringify(payload));
  const signature = signPayload(payloadPart, secret);
  return `${payloadPart}.${signature}`;
}

export function verifyAccessToken(token, secret) {
  if (!token || typeof token !== 'string' || !token.includes('.')) {
    return { valid: false, reason: 'Malformed token' };
  }

  const [payloadPart, signature] = token.split('.');
  if (!payloadPart || !signature) {
    return { valid: false, reason: 'Malformed token' };
  }

  const expected = signPayload(payloadPart, secret);
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return { valid: false, reason: 'Invalid signature' };
  }

  let payload;
  try {
    payload = JSON.parse(fromBase64Url(payloadPart));
  } catch {
    return { valid: false, reason: 'Invalid payload' };
  }

  if (!payload?.exp || Date.now() > Number(payload.exp)) {
    return { valid: false, reason: 'Expired token' };
  }

  return { valid: true, payload };
}
