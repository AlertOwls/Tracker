import { NextResponse } from 'next/server';
import { isAuthEnabled } from '@/lib/auth-session';

export async function GET() {
  return NextResponse.json({ enabled: isAuthEnabled() });
}
