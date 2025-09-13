import {NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';
import arcjet, { createMiddleware, detectBot } from "@arcjet/next";
import { env } from './lib/env';

const aj = arcjet({
  key: env.ARCJET_KEY!, // Get your site key from https://app.arcjet.com
  rules: [
    detectBot({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      // Block all bots except the following
      allow: [
        "CATEGORY:MONITOR",
        "CATEGORY:PREVIEW",
        "CATEGORY:SEARCH_ENGINE",
        "STRIPE_WEBHOOK"
      ],
    }),
  ],
});

async function authMiddleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);

    if (!sessionCookie) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};

// Pass any existing middleware with the optional existingMiddleware prop
export default createMiddleware(aj, async (request: NextRequest) => {
    if (request.nextUrl.pathname.startsWith("/admin")) {
        return authMiddleware(request);
    }

    return NextResponse.next();
});
