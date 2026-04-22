'use client';

import { Suspense } from 'react';
import { FormProvider, useWatch } from 'react-hook-form';
import { z } from 'zod';
import {
	FieldGroup,
	FieldLegend,
	FieldSeparator,
	FieldSet,
} from '@/components/ui/field';
import { bots, type EndpointConfig } from '@/lib/endpoints';
import { useZodForm } from '@/lib/form';
import { BotSelector } from './bot-selector';
import { ChatPreview } from './chat-preview';
import { ChatTextEditor } from './chat-text-editor';
import { CommandName } from './command-name';
import { CommandOutput } from './command-output';
import { EndpointDetails } from './endpoint-details';
import { EndpointParamField } from './endpoint-param-field';

const CommandGeneratorFormDataSchema = z.object({
	selectedBot: z.enum(['nightbot', 'streamelements', 'botrix']),
	liveCommand: z.string().min(1, 'Command name is required'),
	endpointParams: z.record(z.string(), z.string()),
	endpointQueryParams: z.record(z.string(), z.string()),
	textPresets: z.string().optional(),
	chatText: z.string().optional(),
});

export type CommandGeneratorFormData = z.infer<
	typeof CommandGeneratorFormDataSchema
>;

interface CommandGeneratorProps {
	endpoint: EndpointConfig;
}

export function CommandGenerator({ endpoint }: CommandGeneratorProps) {
	const methods = useZodForm(CommandGeneratorFormDataSchema, {
		mode: 'all',
		defaultValues: {
			selectedBot: 'nightbot',
			liveCommand: endpoint.defaultCommandName,
			endpointParams: endpoint.params.reduce(
				(acc, param) => {
					acc[param.id] = param.defaultValue || '';
					return acc;
				},
				{} as Record<string, string>,
			),
			endpointQueryParams: endpoint.queryParams.reduce(
				(acc, qp) => {
					acc[qp.id] = qp.defaultValue || '';
					return acc;
				},
				{} as Record<string, string>,
			),
			chatText: '',
		},
	});

	const endpointParams =
		useWatch({ control: methods.control, name: 'endpointParams' }) || {};
	const endpointQueryParams =
		useWatch({ control: methods.control, name: 'endpointQueryParams' }) || {};
	const selectedBot = useWatch({
		control: methods.control,
		name: 'selectedBot',
	});
	const liveCommand = useWatch({
		control: methods.control,
		name: 'liveCommand',
	});
	const chatText = useWatch({ control: methods.control, name: 'chatText' });

	let path = endpoint.pathTemplate;
	for (const [key, value] of Object.entries(endpointParams)) {
		path = path.replace(`{${key}}`, value as string);
	}

	const searchParams = new URLSearchParams();

	for (const [key, value] of Object.entries(endpointQueryParams)) {
		if (!value) continue;
		searchParams.append(key, value as string);
	}

	const url = new URL(
		path,
		process.env.NEXT_PUBLIC_API_BASE_URL || 'https://cmd.espoca.bot',
	);
	url.search = searchParams.toString();
	const generatedEndpoint = url.toString();

	let generatedCommand = '';
	const bot = bots.find((b) => b.id === selectedBot);
	if (bot && liveCommand) {
		generatedCommand = bot.addCommand(
			liveCommand,
			chatText || endpoint.defaultTemplate,
			generatedEndpoint,
		);
	}

	return (
		<div className="flex flex-col gap-8">
			<header className="flex flex-col gap-3">
				<h1 className="text-balance font-bold text-2xl text-foreground">
					{endpoint.title}
				</h1>
				<p className="text-base text-muted-foreground leading-relaxed">
					{endpoint.description}
				</p>
				<EndpointDetails method={endpoint.method} url={endpoint.pathTemplate} />
			</header>

			<FieldSeparator />

			<FormProvider {...methods}>
				<FieldSet>
					<FieldLegend>Bot</FieldLegend>
					<BotSelector />
				</FieldSet>

				<FieldSeparator />

				<FieldSet>
					<FieldLegend>Configuração</FieldLegend>
					<FieldGroup>
						{endpoint.params.map((param) => (
							<EndpointParamField
								key={param.id}
								control={methods.control}
								param={param}
								type="param"
							/>
						))}

						{endpoint.queryParams.map((queryParam) => (
							<EndpointParamField
								key={queryParam.id}
								control={methods.control}
								queryParam={queryParam}
								type="query"
							/>
						))}
					</FieldGroup>
				</FieldSet>

				<FieldSeparator />

				<FieldSet>
					<FieldLegend>Mensagem do chat</FieldLegend>
					<FieldGroup>
						<CommandName />
						<ChatTextEditor presets={endpoint.textPresets} />
					</FieldGroup>
				</FieldSet>

				<FieldSeparator />

				<Suspense fallback={<div>Loading preview...</div>}>
					<ChatPreview
						endpoint={generatedEndpoint}
						defaultTemplate={endpoint.defaultTemplate}
					/>
				</Suspense>

				<FieldSeparator />

				<CommandOutput command={generatedCommand} />
			</FormProvider>
		</div>
	);
}
