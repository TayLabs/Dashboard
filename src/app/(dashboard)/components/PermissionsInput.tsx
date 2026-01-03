import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import TagInput from '@/components/ui/tag-input';
import { Textarea } from '@/components/ui/textarea';

export default function PermissionsInput() {
	return (
		<FieldSet>
			<Field>
				<FieldLabel>Key</FieldLabel>
				<Input type='text' name='key' id='key' />
			</Field>
			<Field>
				<FieldLabel>Description</FieldLabel>
				<Textarea name='key' id='key' />
			</Field>
			<Field>
				<FieldLabel>Scopes</FieldLabel>
				<TagInput name='scopes' id='scopes' />
			</Field>
		</FieldSet>
	);
}
