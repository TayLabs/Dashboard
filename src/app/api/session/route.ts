import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get('_access_t');

    return Response.json({ success: true, data: { accessToken } });
  } catch (error) {
    return Response.json({ success: false, error: (error as Error).message });
  }
}
