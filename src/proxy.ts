import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 5;
const CLEANUP_INTERVAL = 600_000;

if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap) {
      if (now > value.resetAt) rateLimitMap.delete(key);
    }
  }, CLEANUP_INTERVAL);
}

const BLOCKED_USER_AGENTS = [
  'bytespider',
  'scrapy',
  'go-http-client',
  'python-requests',
  'python-urllib',
  'masscan',
  'nmap',
  'zgrab',
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // --- Security Headers ---
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // --- X-Robots-Tag for API routes ---
  if (pathname.startsWith('/api/')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  // --- Bot Detection ---
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
  if (BLOCKED_USER_AGENTS.some((agent) => userAgent.includes(agent))) {
    return new NextResponse(' ', { status: 403 });
  }

  // --- Rate Limiting (API routes only) ---
  if (pathname.startsWith('/api/')) {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (record && now < record.resetAt) {
      record.count++;
      if (record.count > RATE_LIMIT_MAX) {
        return NextResponse.json(
          { error: 'Too many requests. Please wait before trying again.' },
          { status: 429 }
        );
      }
    } else {
      rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
