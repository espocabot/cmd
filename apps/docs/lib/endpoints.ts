export interface BotTemplate {
	id: string;
	name: string;
	addCommand: (commandName: string, message: string, url: string) => string;
}

export type EndpointQueryParam = {
	id: string;
	label: string;
	description: string;
	placeholder?: string;
	defaultValue?: string;
} & (SelectParam | TextParam);

export type EndpointParam = {
	id: string;
	label: string;
	description: string;
	placeholder?: string;
	required: boolean;
	defaultValue?: string;
} & (SelectParam | TextParam);

type SelectParam = {
	type: 'select';
	options: { value: string; label: string }[];
};

type TextParam = {
	type: 'text';
	minLength?: number;
	maxLength?: number;
};

export type TextPreset = {
	id: string;
	label: string;
	template: string;
};

export interface EndpointConfig {
	id: string;
	slug: string;
	title: string;
	description: string;
	method: string;
	pathTemplate: string;
	queryParams: EndpointQueryParam[];
	params: EndpointParam[];
	textPresets: TextPreset[];
	defaultTemplate: string;
	defaultCommandName: string;
	resultPlaceholder: string;
	mockResult: string;
}

export interface Subcategory {
	id: string;
	slug: string;
	label: string;
	icon: string;
	endpoints: EndpointConfig[];
}

export interface Category {
	id: string;
	slug: string;
	label: string;
	icon: string;
	subcategories: Subcategory[];
}

export const bots: BotTemplate[] = [
	{
		id: 'nightbot',
		name: 'Nightbot',
		addCommand: (cmd, msg, url) =>
			`!addcom ${cmd} ${msg.replace('{result}', `$(urlfetch ${url})`)}`,
	},
	{
		id: 'streamelements',
		name: 'StreamElements',
		addCommand: (cmd, msg, url) =>
			`!command add ${cmd} ${msg.replace('{result}', `\${urlfetch ${url}}`)}`,
	},
	{
		id: 'botrix',
		name: 'Botrix',
		addCommand: (cmd, msg, url) =>
			`!addcom ${cmd} ${msg.replace('{result}', `fetch[${url}]`)}`,
	},
];

export type Lang = 'pt-BR' | 'en-US' | 'es-ES';

export const langOptions = [
	{ value: 'pt-BR', label: 'Português (BR)' },
	{ value: 'en-US', label: 'English (US)' },
	{ value: 'es-ES', label: 'Español (ES)' },
] satisfies { value: Lang; label: string }[];

// --- Endpoints ---

const steamHoursEndpoint: EndpointConfig = {
	id: 'steam-hours',
	slug: 'hours',
	title: 'Horas jogadas',
	description:
		'Mostra no chat da live quantas horas um jogador ja jogou um jogo na Steam.',
	method: 'GET',
	pathTemplate: '/api/{lang}/steam/hours/{steam_id}/{app_id}',
	queryParams: [
		{
			id: 'text_format',
			label: 'Formato do texto',
			description: 'Como a resposta vai aparecer no chat',
			type: 'select',
			options: [
				{ value: 'casual', label: 'Casual' },
				{ value: 'compact', label: 'Compacto' },
				{ value: 'detailed', label: 'Detalhado' },
				{ value: 'full', label: 'Completo' },
				{ value: 'minimal', label: 'Minimo' },
			],
			defaultValue: 'casual',
		},
	],
	params: [
		{
			id: 'lang',
			label: 'Idioma',
			description: 'Idioma da resposta no chat',
			type: 'select',
			options: langOptions,
			defaultValue: 'pt-BR',
			required: true,
		},
		{
			id: 'steam_id',
			label: 'Steam ID',
			description: 'ID do perfil Steam do jogador',
			type: 'text',
			placeholder: '76561198140203933',
			defaultValue: '76561198209279900',
			required: true,
		},
		{
			id: 'app_id',
			label: 'App ID do jogo',
			description: 'ID do jogo na loja da Steam',
			type: 'text',
			placeholder: '381210',
			defaultValue: '381210',
			required: true,
		},
	],
	textPresets: [
		{ id: 'simple', label: 'Simples', template: '{result}' },
		{
			id: 'zoeira',
			label: 'Zoeira',
			template: 'O streamer ja jogou {result} e ainda eh ruim kkkk',
		},
		{
			id: 'informativo',
			label: 'Informativo',
			template: 'Tempo de jogo: {result}',
		},
	],
	defaultTemplate: 'O Souza ja jogou {result}',
	defaultCommandName: 'horas',
	resultPlaceholder: '{result}',
	mockResult: '1.234 horas de Dead by Daylight',
};

const steamNicknameEndpoint: EndpointConfig = {
	id: 'steam-nickname',
	slug: 'nickname',
	title: 'Nickname atual',
	description: 'Mostra no chat o nome de exibicao atual do jogador na Steam.',
	method: 'GET',
	pathTemplate: '/api/{lang}/steam/nickname/{steam_id}',
	queryParams: [],
	params: [
		{
			id: 'lang',
			label: 'Idioma',
			description: 'Idioma da resposta no chat',
			type: 'select',
			options: langOptions,
			required: true,
		},
		{
			id: 'steam_id',
			label: 'Steam ID',
			description: 'ID do perfil Steam do jogador',
			type: 'text',
			placeholder: '76561198140203933',
			defaultValue: '76561198209279900',
			required: true,
		},
	],
	textPresets: [
		{ id: 'simple', label: 'Simples', template: '{result}' },
		{
			id: 'informativo',
			label: 'Informativo',
			template: 'Nick na Steam: {result}',
		},
	],
	defaultTemplate: 'O nick do streamer na Steam eh: {result}',
	defaultCommandName: 'nick',
	resultPlaceholder: '{result}',
	mockResult: 'SouzaBoy',
};

const youtubeLatestVideoEndpoint: EndpointConfig = {
	id: 'youtube-latest-video',
	slug: 'latest-video',
	title: 'Último vídeo',
	description: 'Mostra o título e link do último vídeo de um canal do YouTube.',
	method: 'GET',
	pathTemplate: '/api/{lang}/youtube/latest-video/{handle_or_id}',
	queryParams: [
		{
			id: 'type',
			label: 'Tipo de vídeo',
			description: 'Filtra por tipo de conteúdo',
			type: 'select',
			options: [
				{ value: 'video', label: 'Vídeo' },
				{ value: 'short', label: 'Short' },
				{ value: 'live', label: 'Live' },
				{ value: 'any', label: 'Qualquer' },
			],
			defaultValue: 'any',
		},
		{
			id: 'omit_hashtags',
			label: 'Ocultar hashtags',
			description: 'Remove hashtags do título',
			type: 'select',
			options: [
				{ value: 'false', label: 'Não' },
				{ value: 'true', label: 'Sim' },
			],
			defaultValue: 'false',
		},
	],
	params: [
		{
			id: 'lang',
			label: 'Idioma',
			description: 'Idioma da resposta no chat',
			type: 'select',
			options: langOptions,
			required: true,
		},
		{
			id: 'handle_or_id',
			label: 'Handle ou ID',
			description: 'Handle do canal (com @) ou ID do canal',
			type: 'text',
			placeholder: '@MrBeast',
			required: true,
		},
	],
	textPresets: [
		{ id: 'simple', label: 'Simples', template: '{result}' },
		{
			id: 'informativo',
			label: 'Informativo',
			template: 'Último vídeo: {result}',
		},
	],
	defaultTemplate: 'Saiu vídeo novo! {result}',
	defaultCommandName: 'video',
	resultPlaceholder: '{result}',
	mockResult: 'I Buried Myself Alive For 7 Days - https://youtu.be/xxx',
};

const datetimeCountdownEndpoint: EndpointConfig = {
	id: 'datetime-countdown',
	slug: 'countdown',
	title: 'Contagem regressiva',
	description: 'Mostra quanto tempo falta para uma data/evento especifico.',
	method: 'GET',
	pathTemplate: '/api/{lang}/misc/date-time/countdown',
	queryParams: [
		{
			id: 'datetime',
			label: 'Data alvo',
			description: 'Data e hora (ex: 2026-12-25T00:00:00Z)',
			type: 'text',
			placeholder: '2026-12-25T00:00:00Z',
			defaultValue: '2026-12-25T00:00:00Z',
		},
		{
			id: 'text-format',
			label: 'Formato do texto',
			description: 'Formato para exibir no chat',
			type: 'select',
			options: [
				{ value: 'casual', label: 'Casual' },
				{ value: 'compact', label: 'Compacto' },
				{ value: 'detailed', label: 'Detalhado' },
				{ value: 'full', label: 'Completo' },
				{ value: 'minimal', label: 'Minimo' },
			],
			defaultValue: 'casual',
		},
	],
	params: [
		{
			id: 'lang',
			label: 'Idioma',
			description: 'Idioma da resposta no chat',
			type: 'select',
			options: langOptions,
			required: true,
		},
	],
	textPresets: [
		{ id: 'simple', label: 'Simples', template: '{result}' },
		{
			id: 'hype',
			label: 'Hype',
			template: 'FALTAM {result} BORA!!',
		},
	],
	defaultTemplate: 'Faltam {result}',
	defaultCommandName: 'countdown',
	resultPlaceholder: '{result}',
	mockResult: '319 dias, 8 horas e 18 minutos',
};

// --- Category Tree ---

export const categories: Category[] = [
	{
		id: 'social',
		slug: 'social',
		label: 'Social',
		icon: 'users',
		subcategories: [
			{
				id: 'steam',
				slug: 'steam',
				label: 'Steam',
				icon: 'gamepad-2',
				endpoints: [steamHoursEndpoint, steamNicknameEndpoint],
			},
			{
				id: 'youtube',
				slug: 'youtube',
				label: 'YouTube',
				icon: 'play',
				endpoints: [youtubeLatestVideoEndpoint],
			},
		],
	},
	{
		id: 'miscellaneous',
		slug: 'misc',
		label: 'Diversos',
		icon: 'box',
		subcategories: [
			{
				id: 'datetime',
				slug: 'datetime',
				label: 'Data e Hora',
				icon: 'clock',
				endpoints: [datetimeCountdownEndpoint],
			},
		],
	},
];

// Helpers to find endpoints by slug path
export function findEndpointByPath(
	categorySlug: string,
	subcategorySlug: string,
	endpointSlug: string,
): EndpointConfig | undefined {
	const category = categories.find((c) => c.slug === categorySlug);
	if (!category) return undefined;
	const sub = category.subcategories.find((s) => s.slug === subcategorySlug);
	if (!sub) return undefined;
	return sub.endpoints.find((e) => e.slug === endpointSlug);
}

export function getAllEndpoints(): {
	category: Category;
	subcategory: Subcategory;
	endpoint: EndpointConfig;
}[] {
	const result: {
		category: Category;
		subcategory: Subcategory;
		endpoint: EndpointConfig;
	}[] = [];
	for (const category of categories) {
		for (const subcategory of category.subcategories) {
			for (const endpoint of subcategory.endpoints) {
				result.push({ category, subcategory, endpoint });
			}
		}
	}
	return result;
}
