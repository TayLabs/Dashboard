import { getRole } from '@/actions/roles';
import { Role } from '@/actions/types/interface/Role';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon, InfoIcon } from 'lucide-react';
import { UUID } from 'node:crypto';
import EditRoleForm from './EditRoleForm';
import { getAllServices } from '@/actions/services';
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbSeparator,
	BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { isAuthenticated } from '@/lib/auth';

type EditRolePageProps = {
	params: Promise<{ id: UUID | 'add-role' }>;
};

export default async function EditRolePage({ params }: EditRolePageProps) {
	await isAuthenticated();

	const getAllServicesPromise = getAllServices(); // used to fetch all permissions

	const { id } = await params;

	let response:
		| { success: true; role: Role }
		| { success: false; error: string }
		| null = null;
	if (id !== 'add-role') {
		response = await getRole(id);
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
							<BreadcrumbLink href='/roles'>Roles</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>
								{!response && id === 'add-role'
									? 'Add role'
									: response?.success
									? `Edit ${response.role.name} role`
									: 'Edit role'}
							</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
				<h1 className='text-3xl font-semibold mb-4'>
					{!response && id === 'add-role'
						? 'Add a role'
						: response?.success
						? `Edit ${response.role.name} role`
						: 'Edit role'}
				</h1>
			</div>
			<p className='text-muted-foreground mb-4'>
				Modify a role within your environment to add permissions or change the
				name of it. Internal roles are automatically populated via seed data and
				cannot be modified.
			</p>
			{response?.success && !response?.role.isExternal && (
				<Alert className='mb-4'>
					<AlertTitle className='inline-flex gap-2 items-center'>
						<InfoIcon className='size-5' />
						<span>This role is internal and cannot be edited</span>
					</AlertTitle>
					<AlertDescription>
						Internal roles are automatially seeded to the database upon startup
						and will be overwritten if any changes are made here.
					</AlertDescription>
				</Alert>
			)}
			{response && !response.success ? (
				<Alert variant='destructive'>
					<AlertCircleIcon />
					<AlertTitle>Error loading the role with a id of {id}</AlertTitle>
					<AlertDescription>{response.error}</AlertDescription>
				</Alert>
			) : (
				<EditRoleForm
					getAllServicesPromise={getAllServicesPromise}
					role={response?.success ? response.role : undefined}
				/>
			)}
		</section>
	);
}
