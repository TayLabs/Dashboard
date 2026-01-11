import { getService } from '@/actions/services';
import { Service } from '@/actions/types/interface/Service.interface';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';
import Link from 'next/link';
import EditServiceForm from './EditServiceForm';
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbSeparator,
	BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { isAuthenticated } from '@/lib/auth';

type EditServicePageProps = {
	params: Promise<{ name: 'add-service' | string }>;
};

export default async function EditServicePage({
	params,
}: EditServicePageProps) {
	await isAuthenticated();

	const { name } = await params;

	let serviceResponse:
		| ({ success: true; service: Service } | { success: false; error: string })
		| null = null;
	if (name !== 'add-service') {
		serviceResponse = await getService(name);
	}

	return (
		<section className='container max-w-2xl'>
			<div className='grid gap-2'>
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href='/'>Home</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink href='/services'>Services</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>
								{!serviceResponse && name === 'add-service'
									? 'Add service'
									: `Edit ${name} service`}
							</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
				<h1 className='text-3xl font-semibold mb-4'>
					{!serviceResponse && name === 'add-service'
						? 'Add a service'
						: `Edit ${name} service`}
				</h1>
			</div>
			<p className='text-muted-foreground mb-10'>
				Modify a service within your environment to add permissions or change
				the name of it. Internal services are automatically populated via
				a&nbsp;
				<code className='bg-muted px-2 rounded-sm shadow-xs'>
					taylab.config.yml
				</code>
				&nbsp;and cannot be modified.
			</p>
			{serviceResponse && !serviceResponse.success ? (
				<Alert variant='destructive'>
					<AlertCircleIcon />
					<AlertTitle>
						Error loading the service with a name of {name}
					</AlertTitle>
					<AlertDescription>
						<p>
							Would you like to&nbsp;
							<Link
								href={`/services/add-service?name=${name}`}
								className='underline underline-offset-2'>
								create a service
							</Link>
							&nbsp;with this name?
						</p>
					</AlertDescription>
				</Alert>
			) : (
				<EditServiceForm
					service={
						serviceResponse?.success ? serviceResponse.service : undefined
					}
				/>
			)}
		</section>
	);
}
