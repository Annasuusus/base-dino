import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Fallback: rewrite /.well-known/farcaster.json → /api/farcaster-manifest
 * (Vercel may block .well-known rewrites; static file from public/ is primary)
 */
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/.well-known/farcaster.json") {
    return NextResponse.rewrite(new URL("/api/farcaster-manifest", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/.well-known/farcaster.json"],
};
