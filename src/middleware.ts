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

const ALLOWED_BOTS = [
  'googlebot',
  'bingbot',
  'duckduckbot',
  'yandexbot',
  'baiduspider',
  'twitterbot',
  'facebookexternalhit',
];

const BLOCKED_USER_AGENTS = [
  'bytespider', 'scrapy', 'go-http-client', 'python-requests', 'python-urllib',
  'masscan', 'nmap', 'zgrab', 'semrush', 'ahrefs', 'dotbot', 'mj12bot',
  'dataforseo', 'gptbot', 'claudebot', 'anthropic-ai', 'perplexity',
  'linkedinbot', 'slackbot', 'discordbot',
  'headless', 'phantomjs', 'puppeteer', 'playwright', 'selenium', 'webdriver',
  'crawler', 'spider', 'scraper', 'botlink', 'heritrix', 'httrack',
  'java/', 'wget/', 'ruby', 'go-http-client', 'axios',
  'lighthouse', 'chrome-lighthouse', 'google page speed',
  'petalbot', 'pagespeed', 'pingdom', 'newrelic', 'datadog',
  'zgrab', 'netsystemsresearch', 'netcraft',
];

const BLOCKED_UA_PATTERNS = [
  /headless/i, /phantom/i, /puppeteer/i, /playwright/i,
  /selenium/i, /webdriver/i, /^$/,
];

const ALLOWED_BOT_PATTERNS = ALLOWED_BOTS.map((bot) => new RegExp(bot, 'i'));

function getBotCategory(userAgent: string): 'allowed' | 'blocked' | null {
  if (!userAgent) return 'blocked';
  for (const pattern of ALLOWED_BOT_PATTERNS) {
    if (pattern.test(userAgent)) return 'allowed';
  }
  if (BLOCKED_UA_PATTERNS.some((p) => p.test(userAgent))) return 'blocked';
  if (BLOCKED_USER_AGENTS.some((agent) => userAgent.includes(agent))) return 'blocked';
  return null;
}

function isHeadlessBrowser(headers: Headers, userAgent: string): boolean {
  const ua = userAgent || '';

  if (!ua) return true;

  if (/curl|wget|go-http-client|python-requests/.test(ua)) return true;

  const acceptLanguage = headers.get('accept-language');
  const accept = headers.get('accept') || '';
  const secChUa = headers.get('sec-ch-ua');
  const acceptEncoding = headers.get('accept-encoding');

  let signals = 0;
  if (!acceptLanguage) signals++;
  if (!accept.includes('text/html') && !accept.includes('application/json') && !accept.includes('*/*')) signals++;
  if (!secChUa) signals++;
  if (!acceptEncoding) signals++;

  return signals >= 3;
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

  if (ip === '127.0.0.1' || ip === '::1' || ip === 'unknown') {
    return response;
  }

  const botCategory = getBotCategory(userAgent);

  if (botCategory === 'allowed') {
    return response;
  }

  if (botCategory === 'blocked') {
    console.log(`[Middleware] Blocked bot UA — path=${pathname} ip=${ip} user-agent="${request.headers.get('user-agent')}"`);
    return new NextResponse(' ', { status: 403 });
  }

  if (isHeadlessBrowser(request.headers, userAgent)) {
    console.log(`[Middleware] Blocked headless — path=${pathname} ip=${ip} user-agent="${request.headers.get('user-agent')}"`);
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
