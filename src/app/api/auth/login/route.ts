import { NextResponse } from 'next/server';
import {
  COOKIE_NAME,
  createSessionToken,
  credentialsMatch,
  isAuthEnabled,
} from '@/lib/auth-session';

export async function POST(request: Request) {
  if (!isAuthEnabled()) {
    return NextResponse.json({ ok: true, authDisabled: true });
  }

  const body = await request.json().catch(() => ({}));
  const username = String(body.username ?? '').trim();
  const password = String(body.password ?? '');

  if (!credentialsMatch(username, password)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = await createSessionToken(username);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
  });
  return response;
}
