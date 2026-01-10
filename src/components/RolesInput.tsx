'use client';

import { Role } from '@/actions/types/interface/Role';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { UUID } from 'node:crypto';

export default function RolesInput({
	roles,
	value,
	onChange,
	onBlur,
	disabled,
}: Readonly<{
	roles: Role[];
	value: UUID[];
	onChange: (id: UUID, action: 'add' | 'delete') => void;
	onBlur: () => void;
	disabled?: boolean;
}>) {
	return (
		<div className='grid gap-6'>
			{roles.map((role) => (
				<div key={role.id} className='flex items-start gap-3'>
					<Checkbox
						id={`${role.id}-${role.name}`}
						name={`${role.id}-${role.name}`}
						checked={value.includes(role.id)}
						onCheckedChange={(checked) => {
							onChange(role.id, checked ? 'add' : 'delete');
							onBlur();
						}}
						disabled={disabled}
						className='mt-2'
					/>
					<div className='grid gap-2'>
						<Label htmlFor={`${role.id}-${role.name}`}>
							<h5 className='text-lg -mb-2'>{role.name}</h5>
						</Label>
						<p className='text-muted-foreground'>{`${role.permissions.length} permissions`}</p>
					</div>
				</div>
			))}
		</div>
	);
}
