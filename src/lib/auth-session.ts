const COOKIE_NAME = 'tracker_auth';
const SESSION_DAYS = 30;

export { COOKIE_NAME };

export function isAuthEnabled(): boolean {
  return Boolean(
    process.env.TRACKER_AUTH_USERNAME?.trim() && process.env.TRACKER_AUTH_PASSWORD?.trim()
  );
}

function getSecret(): string {
  return (
    process.env.TRACKER_AUTH_SECRET?.trim() ||
    process.env.TRACKER_AUTH_PASSWORD?.trim() ||
    'tracker-dev-secret'
  );
}

async function hmacSign(payload: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function createSessionToken(username: string): Promise<string> {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = `${username}|${exp}`;
  const sig = await hmacSign(payload);
  return `${payload}|${sig}`;
}

export async function verifySessionToken(token: string): Promise<boolean> {
  const parts = token.split('|');
  if (parts.length !== 3) return false;
  const [username, expStr, sig] = parts;
  const exp = Number(expStr);
  if (!username || !Number.isFinite(exp) || exp < Date.now()) return false;
  const payload = `${username}|${exp}`;
  const expected = await hmacSign(payload);
  if (sig.length !== expected.length) return false;
  let ok = true;
  for (let i = 0; i < sig.length; i++) {
    if (sig[i] !== expected[i]) ok = false;
  }
  return ok;
}

export function credentialsMatch(username: string, password: string): boolean {
  if (!isAuthEnabled()) return true;
  return (
    username === process.env.TRACKER_AUTH_USERNAME &&
    password === process.env.TRACKER_AUTH_PASSWORD
  );
}
