export const runtime = 'edge';

import { NextResponse } from 'next/server';

const visitCount = new Map<string, { count: number; lastSeen: number }>();

function cleanup() {
  const threshold = Date.now() - 3600_000;
  for (const [key, value] of visitCount) {
    if (value.lastSeen < threshold) visitCount.delete(key);
  }
}

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
             request.headers.get('x-real-ip') ||
             'unknown';

  const referer = request.headers.get('referer') || 'direct';
  const userAgent = request.headers.get('user-agent') || 'unknown';

  console.log(`[Visit] ip=${ip} referer=${referer} user-agent=${userAgent}`);

  cleanup();
  const now = Date.now();
  const existing = visitCount.get(ip);

  if (existing && now - existing.lastSeen < 60_000) {
    existing.lastSeen = now;
  } else {
    visitCount.set(ip, { count: (existing?.count || 0) + 1, lastSeen: now });
  }

  const uniqueVisitors = visitCount.size;
  const totalVisits = Array.from(visitCount.values()).reduce((sum, v) => sum + v.count, 0);

  return NextResponse.json({
    uniqueVisitors,
    totalVisits,
    tracked: true,
  });
}
