import type { Context } from 'hono';
import { env } from 'hono/adapter';
import type { HonoEnv } from '@/definitions/config.ts';
import {
	type CachedNicknameData,
	type CachedPlaytimeData,
	getPlaytimeResponseDataFromSteamSchema,
	getPlayerSummariesResponseFromSteamSchema,
	type PlaytimeTextFormat,
} from '@/definitions/steam.ts';
import { getTimeInfoFromMinutes } from '@/helpers/timers.ts';
import { getKV, setKV } from '@/lib/kv.ts';
import { logger } from '@/lib/logger.ts';
import { err, ok } from '@/lib/result.ts';
import { getTranslator } from '@/lib/translator.ts';

const DEFAULT_TTL_TIME = 60 * 15; // 15 minutes
const NICKNAME_TTL_TIME = 60 * 5; // 5 minutes

export class SteamProvider {
	#baseUrl = 'https://api.steampowered.com';
	#env: HonoEnv['Bindings'];

	constructor(c: Context<HonoEnv>) {
		this.#env = env(c);
	}

	async getPlaytime({ steamId, appId }: { steamId: string; appId: string }) {
		const cacheKey = `social:steam:playtime:${steamId}:${appId}`;
		const cached = await getKV<CachedPlaytimeData>(cacheKey, 'json');

		const { STEAM_WEB_API_KEY } = this.#env;

		if (cached) {
			logger('Cache hit for:', cacheKey);
			return ok(cached);
		}

		logger(
			`${this.#baseUrl}/IPlayerService/GetOwnedGames/v1/?key=${STEAM_WEB_API_KEY}&steamid=${steamId}&include_appinfo=true&appids_filter[0]=${appId}&format=json`,
		);

		const res = await fetch(
			`${this.#baseUrl}/IPlayerService/GetOwnedGames/v1/?key=${STEAM_WEB_API_KEY}&steamid=${steamId}&include_appinfo=true&appids_filter[0]=${appId}&format=json`,
		);

		if (!res.ok) {
			logger(
				`Failed to fetch data from Steam API: ${res.status} ${res.statusText}`,
			);
			return err(new Error('Failed to fetch data from Steam API'));
		}

		const json = await res.json();
		const parsed = getPlaytimeResponseDataFromSteamSchema.safeParse(json);

		if (!parsed.success) {
			logger('Failed to parse response from Steam API:', parsed.error.message);
			return err(new Error('Failed to parse response from Steam API'));
		}

		const firstGame = parsed.data.response.games[0];
		if (!firstGame) {
			logger('No games found for the given Steam ID and App ID.');
			return err(
				new Error('No games found for the given Steam ID and App ID.'),
			);
		}

		const data: CachedPlaytimeData = {
			playtimeInMinutes: firstGame.playtime_forever,
			gameName: firstGame.name,
		};

		logger('Fetched data from Steam API:', JSON.stringify(data));

		await setKV(cacheKey, JSON.stringify(data), {
			expirationTtl: DEFAULT_TTL_TIME,
		});

		return ok(data);
	}

	getPlaytimeText(
		playtimeMinutes: number,
		gameName: string,
		format: PlaytimeTextFormat,
	) {
		const timeInfoFromMinutes = getTimeInfoFromMinutes(playtimeMinutes);
		const t = getTranslator();

		const key = `social.steam.hours.${format}` as const;

		logger(
			`Using format key: ${key} with time info: ${playtimeMinutes} and game title: ${gameName}`,
		);
		return t(key, { ...timeInfoFromMinutes, gameName });
	}

	async getNickname({ steamId }: { steamId: string }) {
		const cacheKey = `social:steam:nickname:${steamId}`;
		const cached = await getKV<CachedNicknameData>(cacheKey, 'json');

		const { STEAM_WEB_API_KEY } = this.#env;

		if (cached) {
			logger('Cache hit for:', cacheKey);
			return ok(cached);
		}

		const url = `${this.#baseUrl}/ISteamUser/GetPlayerSummaries/v2/?key=${STEAM_WEB_API_KEY}&steamids=${steamId}&format=json`;
		logger(url);

		const res = await fetch(url);

		if (!res.ok) {
			logger(
				`Failed to fetch data from Steam API: ${res.status} ${res.statusText}`,
			);
			return err(new Error('Failed to fetch data from Steam API'));
		}

		const json = await res.json();
		const parsed =
			getPlayerSummariesResponseFromSteamSchema.safeParse(json);

		if (!parsed.success) {
			logger(
				'Failed to parse response from Steam API:',
				parsed.error.message,
			);
			return err(new Error('Failed to parse response from Steam API'));
		}

		const player = parsed.data.response.players[0];
		if (!player) {
			logger('No player found for the given Steam ID.');
			return err(new Error('No player found for the given Steam ID.'));
		}

		const data: CachedNicknameData = {
			nickname: player.personaname,
		};

		logger('Fetched nickname from Steam API:', JSON.stringify(data));

		await setKV(cacheKey, JSON.stringify(data), {
			expirationTtl: NICKNAME_TTL_TIME,
		});

		return ok(data);
	}
}
