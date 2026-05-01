import { NextResponse, type NextRequest } from "next/server";

const isDev = process.env.NODE_ENV !== "production";
const strictTransportSecurity =
  "max-age=63072000; includeSubDomains; preload";

const buildContentSecurityPolicy = (nonce: string) =>
  [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval' 'unsafe-inline' http: https:" : ""}`,
    `style-src 'self' 'nonce-${nonce}'${isDev ? " 'unsafe-inline'" : ""}`,
    "img-src 'self' blob: data:",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    `connect-src 'self'${isDev ? " http: https: ws: wss:" : ""}`,
    "manifest-src 'self'",
    "media-src 'self'",
    "worker-src 'self' blob:",
    isDev ? "" : "upgrade-insecure-requests",
  ]
    .filter(Boolean)
    .join("; ");

export function middleware(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const contentSecurityPolicy = buildContentSecurityPolicy(nonce);
  const requestHeaders = new Headers(request.headers);

  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", contentSecurityPolicy);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", contentSecurityPolicy);
  response.headers.set("Strict-Transport-Security", strictTransportSecurity);

  return response;
}

export const config = {
  matcher: [
    /*
     * Apply CSP to pages, API routes, public files, and static chunks while
     * skipping only Next's image optimizer.
     */
    "/((?!_next/image).*)",
  ],
};
