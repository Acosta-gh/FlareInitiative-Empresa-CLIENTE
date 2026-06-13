import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 5;

function cleanupExpiredLimits() {
  const now = Date.now();
  for (const [key, value] of rateLimitMap) {
    if (now > value.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}

const BLOCKED_USER_AGENTS = [
  'bytespider', 'scrapy', 'go-http-client', 'python-requests', 'python-urllib',
  'masscan', 'nmap', 'zgrab', 'semrush', 'ahrefs', 'dotbot', 'mj12bot',
  'dataforseo', 'gptbot', 'claudebot', 'anthropic-ai', 'perplexity',
  'facebookexternalhit', 'twitterbot', 'linkedinbot', 'slackbot', 'discordbot',
  'headless', 'phantomjs', 'puppeteer', 'playwright', 'selenium', 'webdriver',
  'crawler', 'spider', 'scraper', 'botlink', 'heritrix', 'httrack',
  'java/', 'curl/', 'wget/', 'ruby', 'go-http-client', 'axios',
  'lighthouse', 'chrome-lighthouse', 'google page speed',
  'petalbot', 'pagespeed', 'pingdom', 'newrelic', 'datadog',
  'zgrab', 'netsystemsresearch', 'netcraft',
];

const BLOCKED_UA_PATTERNS = [
  /headless/i, /phantom/i, /puppeteer/i, /playwright/i,
  /selenium/i, /webdriver/i, /^$/,
];

function isHeadlessBrowser(headers: Headers): boolean {
  const missing: string[] = [];

  if (!headers.get('accept-language')) missing.push('accept-language');
  if (!headers.get('sec-fetch-site')) missing.push('sec-fetch-site');
  if (!headers.get('sec-fetch-mode')) missing.push('sec-fetch-mode');
  if (!headers.get('sec-fetch-dest')) missing.push('sec-fetch-dest');

  const accept = headers.get('accept') || '';
  if (!accept.includes('text/html')) missing.push('accept (no text/html)');

  if (missing.length >= 3) return true;
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  if (pathname.startsWith('/api/')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
             request.headers.get('x-real-ip') ||
             'unknown';

  if (isHeadlessBrowser(request.headers)) {
    console.log(`[Middleware] Blocked headless — path=${pathname} ip=${ip} user-agent="${request.headers.get('user-agent')}"`);
    return new NextResponse(' ', { status: 403 });
  }

  if (BLOCKED_USER_AGENTS.some((agent) => userAgent.includes(agent))) {
    console.log(`[Middleware] Blocked bot UA — path=${pathname} ip=${ip} user-agent="${request.headers.get('user-agent')}"`);
    return new NextResponse(' ', { status: 403 });
  }

  if (pathname.startsWith('/api/')) {
    cleanupExpiredLimits();
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (record && now < record.resetAt) {
      record.count++;
      if (record.count > RATE_LIMIT_MAX) {
        console.log(`[Middleware] Rate limit — path=${pathname} ip=${ip} count=${record.count}`);
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
