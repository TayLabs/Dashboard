import 'server-only';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import type { UUID } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { parseCookie } from '@/utils/cookies';

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
async function refreshTokens(request?: NextRequest) {
	const cookieStore = request?.cookies || (await cookies());

	const selectedSessionId = cookieStore.get('_selected_s')?.value;
	if (!selectedSessionId) {
		throw new Error('There is no active session, please login');
	}

	if (refreshing.has(selectedSessionId)) {
		throw new Error('Token is already refreshing');
	}

	// Refresh the selected session
	refreshing.add(selectedSessionId);

	const reqCookies = cookieStore
		.getAll()
		.reduce((acc, { name, value }) => acc + `${name}=${value};`, '');
	const response = await fetch('http://localhost:7313/api/v1/auth/refresh', {
		method: 'POST',
		headers: {
			Cookie: reqCookies,
		},
	});

	const resBody = (await response.json()) as RefreshResponse;

	if (!resBody.success) {
		throw new Error(
			`Error refreshing: ${response.status} - ${resBody.message}`
		);
	}

	const cookieHeaders = response.headers.getSetCookie();

	for (const cookieHeader of cookieHeaders) {
		cookieStore.set(parseCookie(cookieHeader));
	}

	refreshing.delete(selectedSessionId);

	return resBody.data;
}

/**
 * To be used when requiring authentication in proxy/middleware
 *
 * @param request Set to the request in middlware
 * @param scopes Permission scopes given access to this resource
 */
export async function isAuthenticated(
	request: NextRequest,
	...scopes: string[]
): Promise<boolean>;
/**
 * To be used when requiring authentication in a server action
 *
 * @param scopes Permission scopes given access to this resource
 */
export async function isAuthenticated(...scopes: string[]): Promise<boolean>;
export async function isAuthenticated(
	first: NextRequest | string,
	...rest: string[]
) {
	try {
		const request: NextRequest | undefined =
			typeof first !== 'string' ? first : undefined;
		const scopes: string[] =
			typeof first !== 'string' ? rest : [first, ...rest];

		const accessToken = request
			? request.cookies.get('_access_t')?.value
			: await cookies().then((store) => store.get('_access_t')?.value);
		if (!accessToken) throw new Error('Missing token');

		let payload: AccessTokenPayload | null = await verifyToken(accessToken);
		if (!payload) {
			const { accessToken } = await refreshTokens(request);
			payload = (await jwt.decode(accessToken)) as AccessTokenPayload;
		}

		console.log(payload);

		if (payload.pending != null) {
			throw new Error(`Access pending ${payload.pending}`);
		} else if (!payload.scopes.some((scope) => scopes.includes(scope))) {
			throw new Error('User does not have permission to use this resource');
		}

		return true;
	} catch (error) {
		return false;
	}
}
