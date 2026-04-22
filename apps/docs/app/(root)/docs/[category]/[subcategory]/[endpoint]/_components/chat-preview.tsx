'use client';

import { useWatch } from 'react-hook-form';
import useSWR from 'swr';
import { Field, FieldLabel } from '@/components/ui/field';
import type { CommandGeneratorFormData } from './command-generator';

function isValidUrl(url: string): boolean {
	if (/{[^}]+}/.test(url)) return false;
	if (url.includes('undefined')) return false;
	if (url.includes('null')) return false;

	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
}

interface ChatPreviewProps {
	endpoint: string;
}

export function ChatPreview({ endpoint }: ChatPreviewProps) {
	const { data = '', error } = useSWR(() =>
		isValidUrl(endpoint) ? endpoint : null,
	);
	const { chatText: template = '' } = useWatch<CommandGeneratorFormData>();
	const previewText = template.replace('{result}', data);

	const state = error ? 'error' : data ? 'success' : 'idle';

	const messages = {
		error: 'Parece que ocorreu um erro ao carregar a pré-visualização',
		success: previewText,
		idle: 'Preencha o texto do chat para ver a preview',
	};

	return (
		<Field>
			<FieldLabel>Preview do chat</FieldLabel>
			<div className="rounded-lg border border-border bg-secondary/50 p-4">
				<div className="flex items-start gap-3">
					<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
						<svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
							<path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1.17A7 7 0 0 1 14 22h-4a7 7 0 0 1-6.83-3H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 12 2z" />
						</svg>
					</div>
					<div className="flex flex-col gap-0.5">
						<span className="font-semibold text-primary text-xs">Bot</span>
						<p
							data-state={state}
							className="text-foreground text-sm leading-relaxed data-[state=error]:text-destructive data-[state=loading]:text-muted-foreground data-[state=loading]:italic"
						>
							{messages[state]}
						</p>
					</div>
				</div>
			</div>
		</Field>
	);
}
