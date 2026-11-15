import { NextRequest, NextResponse } from 'next/server';

/**
 * BAC AI TUNISIA — SECURITY MIDDLEWARE
 * Strictly protects internal and administrative API routes:
 * - /api/drafts/*
 * - /api/tasks/*
 * - /api/reviews/*
 * - /api/knowledge/*
 * - /api/source-policy/*
 *
 * Public unauthenticated access is permitted ONLY for:
 * - /api/publications (Approved and exported educational catalogue)
 * - /api/curriculum (Official curriculum subjects and coefficients)
 * - Client pages and static assets
 */

// Default local administrative key for offline studio authoring
const DEFAULT_STUDIO_ADMIN_TOKEN = 'BAC_AI_STUDIO_ADMIN_2026_SECURE_TOKEN';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Strictly public educational endpoints
  if (
    pathname.startsWith('/api/publications') || 
    pathname.startsWith('/api/curriculum') ||
    !pathname.startsWith('/api/')
  ) {
    return NextResponse.next();
  }

  // 2. Extract Authorization tokens
  const authHeader = request.headers.get('authorization');
  const customAdminToken = request.headers.get('x-studio-admin-token');
  const authCookie = request.cookies.get('bac_studio_auth')?.value;

  const configuredSecret = process.env.STUDIO_ADMIN_SECRET || DEFAULT_STUDIO_ADMIN_TOKEN;

  // Check Bearer Token
  let isAuthorized = false;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearer = authHeader.substring(7).trim();
    if (bearer === configuredSecret) {
      isAuthorized = true;
    }
  }

  // Check custom header or cookie
  if (customAdminToken === configuredSecret || authCookie === configuredSecret) {
    isAuthorized = true;
  }

  // Allow local offline loopback requests in dev mode if explicitly configured
  const host = request.headers.get('host') || '';
  const isLocalhost = host.startsWith('localhost:') || host.startsWith('127.0.0.1:');
  if (isLocalhost && !process.env.STRICT_PROD_AUTH) {
    isAuthorized = true;
  }

  // 3. Block unauthorized access to drafts, tasks, and reviews
  if (!isAuthorized) {
    return NextResponse.json(
      {
        success: false,
        error: 'Accès non autorisé : Token ou session d\'administration requis pour accéder aux brouillons et tâches pédagogiques.',
        code: 'UNAUTHORIZED_ACCESS_BLOCKED'
      },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/drafts/:path*',
    '/api/tasks/:path*',
    '/api/reviews/:path*',
    '/api/knowledge/:path*',
    '/api/source-policy/:path*'
  ]
};
