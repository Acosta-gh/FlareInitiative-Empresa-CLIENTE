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
  if (!userAgent) {
    console.log(`[Middleware] Empty UA classified as blocked`);
    return 'blocked';
  }
  for (const pattern of ALLOWED_BOT_PATTERNS) {
    if (pattern.test(userAgent)) {
      console.log(`[Middleware] Allowed bot matched — pattern=${pattern.source} ua="${userAgent}"`);
      return 'allowed';
    }
  }
  for (const p of BLOCKED_UA_PATTERNS) {
    if (p.test(userAgent)) {
      console.log(`[Middleware] Blocked by UA pattern — pattern=${p.source} ua="${userAgent}"`);
      return 'blocked';
    }
  }
  for (const agent of BLOCKED_USER_AGENTS) {
    if (userAgent.includes(agent)) {
      console.log(`[Middleware] Blocked by UA substring — match="${agent}" ua="${userAgent}"`);
      return 'blocked';
    }
  }
  console.log(`[Middleware] Unknown UA category — ua="${userAgent}"`);
  return null;
}

function isHeadlessBrowser(headers: Headers, userAgent: string): boolean {
  const ua = userAgent || '';

  if (!ua) {
    console.log(`[Middleware] Headless: empty UA`);
    return true;
  }

  if (/curl|wget|go-http-client|python-requests/.test(ua)) {
    console.log(`[Middleware] Headless: known tool UA — ua="${ua}"`);
    return true;
  }

  const acceptLanguage = headers.get('accept-language');
  const accept = headers.get('accept') || '';
  const secChUa = headers.get('sec-ch-ua');
  const acceptEncoding = headers.get('accept-encoding');

  let signals = 0;
  const details: string[] = [];
  if (!acceptLanguage) { signals++; details.push('no-accept-language'); }
  if (!accept.includes('text/html') && !accept.includes('application/json') && !accept.includes('*/*')) { signals++; details.push(`accept-no-standard (accept="${accept}")`); }
  if (!secChUa) { signals++; details.push('no-sec-ch-ua'); }
  if (!acceptEncoding) { signals++; details.push('no-accept-encoding'); }

  const isHeadless = signals >= 3;
  if (isHeadless) {
    console.log(`[Middleware] Headless: ${signals}/4 signals — ${details.join(', ')} ua="${ua}"`);
  }
  return isHeadless;
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
    console.log(`[Middleware] Local skip — path=${pathname} ip=${ip} method=${request.method}`);
    return response;
  }

  const botCategory = getBotCategory(userAgent);

  if (botCategory === 'allowed') {
    console.log(`[Middleware] Allowed — path=${pathname} ip=${ip} ua="${request.headers.get('user-agent')}"`);
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
      if (rateLimitMap.size % 50 === 0) {
        console.log(`[Middleware] Rate limit map size=${rateLimitMap.size}`);
      }
    }
  }

  console.log(`[Middleware] Pass — path=${pathname} ip=${ip} method=${request.method} ua="${request.headers.get('user-agent')}"`);
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
