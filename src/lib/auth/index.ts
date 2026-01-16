import 'server-only';
import { cookies } from 'next/headers';
import type { UUID } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { parseCookie } from '@/utils/cookies';
import { getCSRFToken } from './csrf';
import AuthenticationError, {
	Pending2FAError,
	PendingEmailVerificationError,
	PendingPasswordResetError,
} from './types/AuthenticationError';
import { redirect } from 'next/navigation';
import { isExecutedFromServerComponent } from '@/utils/isServerComponent';
import { NextRequest } from 'next/server';

type RefreshResponse =
	| {
			success: true;
			data: {
				pending: PendingActionType;
				accessToken: string;
			};
	  }
	| {
			success: false;
			message: string;
			stack?: string;
	  };

export type PendingActionType =
	| '2fa'
	| 'passwordReset'
	| 'emailVerification'
	| null;

export type AccessTokenPayload = {
	sid: string;
	userId: UUID;
	issuer: string;
	audience: string;
	pending: PendingActionType;
	scopes: string[];
	issuedAt: number;
	iat: number;
	exp: number;
};

function verifyToken(token: string) {
	try {
		return jwt.verify(
			token,
			process.env.ACCESS_TOKEN_SECRET!
		) as AccessTokenPayload;
	} catch {
		return null;
	}
}

const refreshing = new Map<
	string,
	Promise<{ pending: PendingActionType; accessToken: string }>
>();
/**
 * Refreshes access token. To be used in either proxy or server actions
 */
async function refreshSession(): Promise<{
	accessToken: string;
	pending: PendingActionType;
}>;
async function refreshSession(request: NextRequest): Promise<{
	accessToken: string;
	pending: PendingActionType;
}>;
async function refreshSession(request?: NextRequest): Promise<{
	accessToken: string;
	pending: PendingActionType;
}> {
	// try {
	// Called in getAccessToken
	// if (!(await isExecutedFromServerComponent())) {
	// 	throw new Error('Cannot refresh tokens from server component');
	// }

	const cookieStore = await cookies();

	console.log('refreshing');
	const accessToken = cookieStore.get('_access_t')?.value;
	if (accessToken) {
		const payload = verifyToken(accessToken);

		// is token invalid/not verified or going to expire in 2 minutes, if yes, continue refreshing
		if (payload && (payload.exp - 2 * 60) * 1000 > Date.now()) {
			return { accessToken, pending: payload.pending };
		}
	}

	const selectedSessionId = cookieStore.get('_selected_s')?.value;
	if (!selectedSessionId) {
		throw new AuthenticationError(
			'There is no active session, please login',
			'NFND'
		);
	}

	const refresh = async () => {
		// Refresh the selected session
		const csrf = await getCSRFToken();
		const cookieHeader = cookieStore
			.getAll()
			.map(({ name, value }) => `${name}=${value}`)
			.join('; ');
		const response = await fetch('http://localhost:7313/api/v1/auth/refresh', {
			method: 'POST',
			headers: {
				Cookie: cookieHeader,
				'X-CSRF-Token': csrf,
			},
		});

		const resBody = (await response.json()) as RefreshResponse;

		if (!resBody.success) {
			throw new AuthenticationError(
				`Error refreshing: ${response.status} - ${resBody.message}`,
				'UNKN'
			);
		}

		const token = resBody.data.accessToken;
		cookieStore.set('_access_t', token, {
			// expires: ... // Session cookie, refreshes on each new visit/session
			httpOnly: true,
			path: '/',
			domain: 'localhost',
			sameSite: 'lax',
		});
		request?.cookies.set('_access_t', token);

		const cookieHeaders = response.headers.getSetCookie();
		for (const cookieHeader of cookieHeaders) {
			const { name, value, ...options } = parseCookie(cookieHeader);
			console.log(`Setting cookie: ${name}`);
			cookieStore.set(name, value, options);
			request?.cookies.set(name, value);
		}

		return resBody.data;
	};

	// If already refreshing, await that promise and return the data
	if (refreshing.has(selectedSessionId)) {
		return await refreshing.get(selectedSessionId)!;
	}

	const refreshPromise = refresh();
	refreshing.set(selectedSessionId, refreshPromise);

	const result = await refreshPromise;

	refreshing.delete(selectedSessionId);

	return result;
	// } catch (error) {
	//   return null;
	// }
}

/**
 * To be used in server actions when fetching or posting data. Will auto refresh if token is about to expire
 */
export async function getAccessToken() {
	const cookieStore = await cookies();

	let token = cookieStore.get('_access_t')?.value as string | undefined;
	const isServerComponent = await isExecutedFromServerComponent();
	console.log('is ' + (isServerComponent ? 'server' : 'proxy'));
	if (!isServerComponent) {
		const response = await refreshSession();
		token = response?.accessToken;
	}

	return { accessToken: token };
}

/**
 * To be used in server components to require authorization per page
 */
export async function isAuthenticated(options?: {
	allowPending?: NonNullable<PendingActionType>[];
	scopes?: string[];
}) {
	try {
		const cookieStore = await cookies();

		const accessToken = cookieStore.get('_access_t')?.value;
		const payload: AccessTokenPayload | null = accessToken
			? await verifyToken(accessToken)
			: null;

		if (!payload) {
			throw new AuthenticationError('Invalid Token', 'NFND');
		} else if (
			payload.pending != null &&
			!options?.allowPending?.includes(payload.pending)
		) {
			switch (payload.pending) {
				case '2fa':
					throw new Pending2FAError('Access pending two-factor authentication');
				case 'emailVerification':
					throw new PendingEmailVerificationError(
						'Access pending email verification'
					);
				case 'passwordReset':
					throw new PendingPasswordResetError('Access pending password reset');
			}
		} else if (
			options?.scopes &&
			options.scopes.length > 0 &&
			!payload.scopes.some((scope) => options.scopes?.includes(scope))
		) {
			throw new AuthenticationError(
				'User does not have permission to use this resource',
				'NATH'
			);
		}
	} catch (error) {
		if (error instanceof AuthenticationError) {
			switch (error.code) {
				case 'P2FA':
					return redirect('http://localhost:7919/auth/2fa');
				case 'PPRS':
					return redirect('http://localhost:7919/auth/reset-password');
				case 'PEMV':
					return redirect('http://localhost:7919/auth/verify-email');
				case 'NATH':
				default:
					return redirect('http://localhost:7919/auth/login');
			}
		}
	}
}
