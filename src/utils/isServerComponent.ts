import 'server-only';
import { cookies } from 'next/headers';

export async function isExecutedFromServerComponent(): Promise<boolean> {
	try {
		const cookieStore = await cookies();

		cookieStore.set('_', '');
	} catch {
		return true;
	}

	return false;
}
