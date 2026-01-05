import {
  type MiddlewareConfig,
  type NextRequest,
  NextResponse,
} from 'next/server';
import { refreshSession } from './lib/auth';
import AuthenticationError from './lib/auth/types/AuthenticationError';

export async function proxy(request: NextRequest) {
  try {
    await refreshSession();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      switch (error.code) {
        case 'NFND':
        case 'UNKN':
          if (request.nextUrl.pathname !== '/auth/login') {
            return NextResponse.redirect('http://localhost:7919/auth/login');
          }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!auth/login|auth/sign-up|auth/forgot-password|api|_next|.*\\..*).*)', // Everything except /api and static files
  ],
} satisfies MiddlewareConfig;
