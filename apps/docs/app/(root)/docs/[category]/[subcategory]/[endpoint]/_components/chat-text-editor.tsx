'use client';

import { Controller, useFormContext } from 'react-hook-form';
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldLabel,
} from '@/components/ui/field';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupTextarea,
} from '@/components/ui/input-group';
import type { TextPreset } from '@/lib/endpoints';
import type { CommandGeneratorFormData } from './command-generator';

interface ChatTextEditorProps {
	presets: TextPreset[];
}

export function ChatTextEditor({ presets }: ChatTextEditorProps) {
	const { control, setValue } = useFormContext<CommandGeneratorFormData>();
	return (
		<Controller
			control={control}
			name="chatText"
			render={({ field }) => (
				<Field>
					<FieldContent>
						<FieldLabel htmlFor={field.name}>Texto do chat</FieldLabel>
						<FieldDescription>
							{'Use {result} onde quiser que o resultado da API apareça'}
						</FieldDescription>
					</FieldContent>
					<InputGroup>
						<InputGroupTextarea
							id={field.name}
							placeholder="O Souza ja jogou {result}"
							{...field}
						/>
						<InputGroupAddon align="block-end">
							{presets.map((preset) => (
								<InputGroupButton
									key={preset.id}
									size="xs"
									variant="outline"
									onClick={() => setValue('chatText', preset.template)}
								>
									{preset.label}
								</InputGroupButton>
							))}
						</InputGroupAddon>
					</InputGroup>
				</Field>
			)}
		/>
	);
}
