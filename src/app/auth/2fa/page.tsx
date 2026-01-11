import { isAuthenticated } from '@/lib/auth';

export default async function TwoFactorPage() {
	await isAuthenticated({ allowPending: ['2fa'] });

	return <div>TwoFactorPage</div>;
}
