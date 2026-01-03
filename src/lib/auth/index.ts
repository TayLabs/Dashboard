import 'server-only';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import type { UUID } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { parseCookie } from '@/utils/cookies';
import { getCSRFToken } from './csrf';
import AuthenticationError, {
	Pending2FAError,
	PendingEmailVerificationError,
	PendingPasswordResetError,
} from './types/AuthenticationError';

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

const refreshing = new Set();
async function refreshTokens() {
	const cookieStore = await cookies();

	const selectedSessionId = cookieStore.get('_selected_s')?.value;
	if (!selectedSessionId) {
		throw new AuthenticationError(
			'There is no active session, please login',
			'NFND'
		);
	}

	if (refreshing.has(selectedSessionId)) {
		throw new AuthenticationError('Token is already refreshing', 'TRFS');
	}

	// Refresh the selected session
	refreshing.add(selectedSessionId);

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

	const cookieHeaders = response.headers.getSetCookie();
	for (const cookieHeader of cookieHeaders) {
		const { name, value, ...options } = parseCookie(cookieHeader);
		console.log({ name, value, ...options });
		cookieStore.set(name, value, options);
	}

	refreshing.delete(selectedSessionId);

	return resBody.data;
}

export async function isAuthenticated({
	allowPending,
	request,
	scopes,
}: {
	allowPending?: NonNullable<PendingActionType>;
	request?: NextRequest;
	scopes?: string[];
}) {
	const accessToken = request
		? request.cookies.get('_access_t')?.value
		: await cookies().then((store) => store.get('_access_t')?.value);

	let payload: AccessTokenPayload | null = accessToken
		? await verifyToken(accessToken)
		: null;
	if (!payload) {
		const { accessToken } = await refreshTokens();
		payload = (await jwt.decode(accessToken)) as AccessTokenPayload;
	}

	if (payload.pending != null && payload.pending !== allowPending) {
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
		scopes &&
		scopes.length > 0 &&
		!payload.scopes.some((scope) => scopes.includes(scope))
	) {
		throw new Error('User does not have permission to use this resource');
	}
}
