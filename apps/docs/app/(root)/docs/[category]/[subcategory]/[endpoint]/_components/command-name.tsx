import { Controller, useFormContext } from 'react-hook-form';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@/components/ui/input-group';
import type { CommandGeneratorFormData } from './command-generator';

export function CommandName() {
	const { control } = useFormContext<CommandGeneratorFormData>();
	return (
		<Controller
			name="liveCommand"
			control={control}
			render={({ field }) => {
				return (
					<Field>
						<FieldLabel>Nome do comando</FieldLabel>
						<InputGroup>
							<InputGroupAddon>
								<InputGroupText>!</InputGroupText>
							</InputGroupAddon>
							<InputGroupInput placeholder="horas" {...field} />
						</InputGroup>
						<FieldDescription>
							O comando que os viewers vao digitar no chat (ex: !horas)
						</FieldDescription>
					</Field>
				);
			}}
		/>
	);
}
