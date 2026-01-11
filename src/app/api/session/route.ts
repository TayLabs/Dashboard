import { cookies } from 'next/headers';

/**
 * A endpoint for the client to get the access token to make requests
 * @returns Access token cookie's value
 */
export async function GET() {
	try {
		const cookieStore = await cookies();

		const accessToken = cookieStore.get('_access_t');

		return Response.json({ success: true, data: { accessToken } });
	} catch (error) {
		return Response.json({ success: false, error: (error as Error).message });
	}
}
