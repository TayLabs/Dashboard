import {
	NextResponse,
	type MiddlewareConfig,
	type NextRequest,
} from 'next/server';
import { isAuthenticated } from './lib/auth';

export async function proxy(request: NextRequest) {
	if (!(await isAuthenticated(request))) {
		return NextResponse.redirect('http://localhost:7919/auth/login');
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/'],
} satisfies MiddlewareConfig;
