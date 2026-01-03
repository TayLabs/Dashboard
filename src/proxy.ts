import {
	NextResponse,
	type MiddlewareConfig,
	type NextRequest,
} from 'next/server';
import { isAuthenticated } from './lib/auth';
import AuthenticationError, {
	Pending2FAError,
	PendingEmailVerificationError,
	PendingPasswordResetError,
} from './lib/auth/types/AuthenticationError';

export async function proxy(request: NextRequest) {
	try {
		await isAuthenticated({ request });
	} catch (error) {
		if (error instanceof AuthenticationError) {
			switch (error.code) {
				case 'P2FA':
					return NextResponse.redirect('http://localhost:7919/auth/2fa');
				case 'PPRS':
					return NextResponse.redirect(
						'http://localhost:7919/auth/reset-password'
					);
				case 'PEMV':
					return NextResponse.redirect(
						'http://localhost:7919/auth/verify-email'
					);
				default:
					return NextResponse.redirect('http://localhost:7919/auth/login');
			}
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/'],
} satisfies MiddlewareConfig;
