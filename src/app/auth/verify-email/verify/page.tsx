'use client';

import { verifyEmail } from '@/actions/email';
import { FormActionResponse } from '@/actions/types/FormAction';
import { Button } from '@/components/ui/button';
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@/components/ui/empty';
import { CheckCircle2Icon } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EmailVerificationVerify() {
	const searchParams = useSearchParams();
	const token = searchParams.get('t');

	const [response, setResponse] = useState<FormActionResponse>();
	useEffect(() => {
		const verifyToken = async () => {
			if (token) {
				const response = await verifyEmail(token);
				setResponse(response);
			}
		};

		verifyToken();
	}, [token]);

	if (!token) {
		return (
			<section className='container max-w-sm'>
				<h3 className='text-xl'>Token is missing</h3>
			</section>
		);
	} else if (!response) {
		return <p>Loading...</p>;
	} else if (!response?.success) {
		return (
			<section className='container max-w-sm'>
				<h3 className='text-xl'>
					{response?.error || 'Invalid verification token'}
				</h3>
			</section>
		);
	}

	return (
		<section className='container max-w-sm'>
			<Empty>
				<EmptyMedia variant='icon'>
					<CheckCircle2Icon />
				</EmptyMedia>
				<EmptyHeader>
					<EmptyTitle>Email verified!</EmptyTitle>
					<EmptyDescription>
						Your email has been verified, click below to continue logging in.
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<Link href='/'>
						<Button>View Dashboard</Button>
					</Link>
				</EmptyContent>
			</Empty>
		</section>
	);
}
