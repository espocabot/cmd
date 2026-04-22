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

const steamGameEndpoint: EndpointConfig = {
	id: 'steam-current-game',
	slug: 'current-game',
	title: 'Jogo atual',
	description:
		'Mostra no chat qual jogo o jogador esta jogando agora na Steam.',
	method: 'GET',
	pathTemplate: '/api/{lang}/steam/current-game/{steam_id}',
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
			required: true,
		},
	],
	textPresets: [
		{ id: 'simple', label: 'Simples', template: '{result}' },
		{
			id: 'informativo',
			label: 'Informativo',
			template: 'Jogando agora: {result}',
		},
	],
	defaultTemplate: 'Agora jogando: {result}',
	defaultCommandName: 'jogo',
	resultPlaceholder: '{result}',
	mockResult: 'Dead by Daylight',
};

const twitchFollowAgeEndpoint: EndpointConfig = {
	id: 'twitch-followage',
	slug: 'followage',
	title: 'Tempo de follow',
	description: 'Mostra ha quanto tempo um usuario segue o canal na Twitch.',
	method: 'GET',
	pathTemplate: '/api/{lang}/twitch/followage/{channel}/{user}',
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
			id: 'channel',
			label: 'Canal',
			description: 'Nome do canal na Twitch',
			type: 'text',
			placeholder: 'gaules',
			required: true,
		},
		{
			id: 'user',
			label: 'Usuario',
			description:
				'Nome do usuario na Twitch (use a variavel do bot para pegar automaticamente)',
			type: 'text',
			placeholder: '$(user)',
			required: true,
		},
	],
	textPresets: [
		{ id: 'simple', label: 'Simples', template: '{result}' },
		{
			id: 'informativo',
			label: 'Informativo',
			template: 'Seguindo ha: {result}',
		},
	],
	defaultTemplate: '{result}',
	defaultCommandName: 'followage',
	resultPlaceholder: '{result}',
	mockResult: '2 anos, 3 meses e 15 dias',
};

const twitchAccountAgeEndpoint: EndpointConfig = {
	id: 'twitch-accountage',
	slug: 'accountage',
	title: 'Idade da conta',
	description:
		'Mostra ha quanto tempo a conta de um usuario da Twitch foi criada.',
	method: 'GET',
	pathTemplate: '/api/{lang}/twitch/accountage/{user}',
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
			id: 'user',
			label: 'Usuario',
			description: 'Nome do usuario na Twitch',
			type: 'text',
			placeholder: '$(user)',
			required: true,
		},
	],
	textPresets: [
		{ id: 'simple', label: 'Simples', template: '{result}' },
		{
			id: 'informativo',
			label: 'Informativo',
			template: 'Conta criada ha: {result}',
		},
	],
	defaultTemplate: '{result}',
	defaultCommandName: 'accountage',
	resultPlaceholder: '{result}',
	mockResult: '4 anos, 7 meses e 2 dias',
};

const youtubeSubsEndpoint: EndpointConfig = {
	id: 'youtube-subs',
	slug: 'subscribers',
	title: 'Inscritos',
	description: 'Mostra a quantidade de inscritos de um canal do YouTube.',
	method: 'GET',
	pathTemplate: '/api/{lang}/youtube/subscribers/{channel_id}',
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
			id: 'channel_id',
			label: 'ID do canal',
			description: 'ID do canal no YouTube',
			type: 'text',
			placeholder: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
			required: true,
		},
	],
	textPresets: [
		{ id: 'simple', label: 'Simples', template: '{result}' },
		{
			id: 'informativo',
			label: 'Informativo',
			template: 'Inscritos: {result}',
		},
	],
	defaultTemplate: 'O canal tem {result}',
	defaultCommandName: 'inscritos',
	resultPlaceholder: '{result}',
	mockResult: '1,2M inscritos',
};

const tiktokFollowersEndpoint: EndpointConfig = {
	id: 'tiktok-followers',
	slug: 'followers',
	title: 'Seguidores',
	description: 'Mostra a quantidade de seguidores de um perfil no TikTok.',
	method: 'GET',
	pathTemplate: '/api/{lang}/tiktok/followers/{username}',
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
			id: 'username',
			label: 'Username',
			description: 'Nome de usuario no TikTok (sem @)',
			type: 'text',
			placeholder: 'khaby.lame',
			required: true,
		},
	],
	textPresets: [
		{ id: 'simple', label: 'Simples', template: '{result}' },
		{
			id: 'informativo',
			label: 'Informativo',
			template: 'Seguidores no TikTok: {result}',
		},
	],
	defaultTemplate: 'O perfil tem {result}',
	defaultCommandName: 'seguidores',
	resultPlaceholder: '{result}',
	mockResult: '162,3M seguidores',
};

const datetimeNowEndpoint: EndpointConfig = {
	id: 'datetime-now',
	slug: 'now',
	title: 'Data e hora atual',
	description:
		'Mostra a data e hora atual no chat, com fuso horario configuravel.',
	method: 'GET',
	pathTemplate: '/api/{lang}/datetime/now',
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
			id: 'timezone',
			label: 'Fuso horario',
			description: 'Timezone no formato IANA',
			type: 'select',
			options: [
				{ value: 'America/Sao_Paulo', label: 'Brasilia (BRT)' },
				{ value: 'America/New_York', label: 'Nova York (EST)' },
				{ value: 'Europe/Lisbon', label: 'Lisboa (WET)' },
				{ value: 'Europe/Madrid', label: 'Madrid (CET)' },
				{ value: 'UTC', label: 'UTC' },
			],
			required: true,
		},
	],
	textPresets: [
		{ id: 'simple', label: 'Simples', template: '{result}' },
		{
			id: 'informativo',
			label: 'Informativo',
			template: 'Agora sao: {result}',
		},
	],
	defaultTemplate: 'Agora sao {result}',
	defaultCommandName: 'hora',
	resultPlaceholder: '{result}',
	mockResult: '15:42 - 09/02/2026',
};

const datetimeCountdownEndpoint: EndpointConfig = {
	id: 'datetime-countdown',
	slug: 'countdown',
	title: 'Contagem regressiva',
	description: 'Mostra quanto tempo falta para uma data/evento especifico.',
	method: 'GET',
	pathTemplate: '/api/{lang}/datetime/countdown/{target_date}',
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
			id: 'target_date',
			label: 'Data alvo',
			description: 'Data do evento no formato YYYY-MM-DD',
			type: 'text',
			placeholder: '2026-12-25',
			required: true,
		},
		{
			id: 'timezone',
			label: 'Fuso horario',
			description: 'Timezone no formato IANA',
			type: 'select',
			options: [
				{ value: 'America/Sao_Paulo', label: 'Brasilia (BRT)' },
				{ value: 'America/New_York', label: 'Nova York (EST)' },
				{ value: 'Europe/Lisbon', label: 'Lisboa (WET)' },
				{ value: 'UTC', label: 'UTC' },
			],
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
				endpoints: [steamHoursEndpoint, steamGameEndpoint],
			},
			{
				id: 'twitch',
				slug: 'twitch',
				label: 'Twitch',
				icon: 'tv',
				endpoints: [twitchFollowAgeEndpoint, twitchAccountAgeEndpoint],
			},
			{
				id: 'youtube',
				slug: 'youtube',
				label: 'YouTube',
				icon: 'play',
				endpoints: [youtubeSubsEndpoint],
			},
			{
				id: 'tiktok',
				slug: 'tiktok',
				label: 'TikTok',
				icon: 'music',
				endpoints: [tiktokFollowersEndpoint],
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
				endpoints: [datetimeNowEndpoint, datetimeCountdownEndpoint],
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
