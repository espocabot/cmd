'use client';

import { CheckIcon, CopyIcon } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
	Field,
	FieldContent,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field';
import type { CommandGeneratorFormData } from './command-generator';

interface CommandOutputProps {
	command: string;
}

export function CommandOutput({ command }: CommandOutputProps) {
	const [copied, setCopied] = useState(false);
	const {
		formState: { isValid },
	} = useFormContext<CommandGeneratorFormData>();

	const handleCopy = async () => {
		if (!isValid) return;
		try {
			await navigator.clipboard.writeText(command);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// Fallback for older browsers
			const textarea = document.createElement('textarea');
			textarea.value = command;
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand('copy');
			document.body.removeChild(textarea);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	return (
		<FieldGroup>
			<Field>
				<FieldContent>
					<FieldLabel>Comando gerado</FieldLabel>

					<div className="rounded-md bg-accent/80 px-3 py-2 font-mono text-accent-foreground text-sm">
						{isValid
							? command
							: 'Preencha todos os campos obrigatorios para gerar o comando'}
					</div>
				</FieldContent>
			</Field>
			<Field>
				<Button size="lg" onClick={handleCopy} disabled={!isValid}>
					{copied ? (
						<>
							<CheckIcon />
							Copiado!
						</>
					) : (
						<>
							<CopyIcon />
							Copiar comando
						</>
					)}
				</Button>
			</Field>
		</FieldGroup>
	);
}
