import {
	type CachedLatestVideoData,
	type YoutubeVideoType,
	youtubeChannelResponseSchema,
	youtubePlaylistItemsResponseSchema,
	youtubeSearchResponseSchema,
} from '@/definitions/youtube.ts';
import { getEnvs } from '@/lib/env.ts';
import { getKV, setKV } from '@/lib/kv.ts';
import { logger } from '@/lib/logger.ts';
import { err, isErr, ok } from '@/lib/result.ts';

const CACHE_TTL_MAP: Record<YoutubeVideoType, number> = {
	video: 60 * 60, // 1 hour
	short: 60 * 15, // 15 minutes
	live: 60 * 60 * 3, // 3 hours
	any: 60 * 60, // 1 hour
};

export class YoutubeProvider {
	#baseUrl = 'https://www.googleapis.com/youtube/v3';

	async getLatestVideo({
		handleOrId,
		type,
	}: {
		handleOrId: string;
		type: YoutubeVideoType;
	}) {
		const { YOUTUBE_API_KEY } = getEnvs();

		const channelIdResult = await this.#resolveChannelId(
			handleOrId,
			YOUTUBE_API_KEY,
		);
		if (isErr(channelIdResult)) {
			return err(channelIdResult.error);
		}

		const channelId = channelIdResult.value;

		const cacheKey = `social:youtube:latest-video:${channelId}:${type}`;
		const cached = await getKV<CachedLatestVideoData>(cacheKey, 'json');

		if (cached) {
			logger('Cache hit for:', cacheKey);
			return ok(cached);
		}

		if (type === 'short') {
			return this.#getLatestFromShortsPlaylist(
				channelId,
				YOUTUBE_API_KEY,
				cacheKey,
			);
		}

		if (type === 'video') {
			return this.#getLatestLongFormVideo(channelId, YOUTUBE_API_KEY, cacheKey);
		}

		if (type === 'live') {
			return this.#getLatestFromLivePlaylist(
				channelId,
				YOUTUBE_API_KEY,
				cacheKey,
			);
		}

		// type === 'any': just get the most recent upload
		return this.#getLatestUpload(channelId, YOUTUBE_API_KEY, cacheKey);
	}

	/**
	 * Gets the latest Short using the channel's UUSH playlist.
	 * YouTube internally maintains a playlist with prefix UUSH that contains
	 * only Shorts, regardless of duration (supports 3-min Shorts).
	 */
	async #getLatestFromShortsPlaylist(
		channelId: string,
		apiKey: string,
		cacheKey: string,
	) {
		// Channel IDs start with UC, replace with UUSH to get the Shorts playlist
		const shortsPlaylistId = channelId.replace(/^UC/, 'UUSH');

		const params = new URLSearchParams({
			part: 'snippet',
			playlistId: shortsPlaylistId,
			maxResults: '1',
			key: apiKey,
		});

		const url = `${this.#baseUrl}/playlistItems?${params.toString()}`;
		logger(url);

		const res = await fetch(url);

		if (!res.ok) {
			logger(
				`Failed to fetch Shorts playlist: ${res.status} ${res.statusText}`,
			);
			return err(new Error('Failed to fetch Shorts playlist'));
		}

		const json = await res.json();
		const parsed = youtubePlaylistItemsResponseSchema.safeParse(json);

		if (!parsed.success) {
			logger('Failed to parse Shorts playlist response:', parsed.error.message);
			return err(new Error('Failed to parse Shorts playlist response'));
		}

		const firstItem = parsed.data.items[0];
		if (!firstItem) {
			logger(`No Shorts found for channel ID: ${channelId}`);
			return err(new Error('No Shorts found for this channel'));
		}

		const data: CachedLatestVideoData = {
			title: firstItem.snippet.title,
			videoId: firstItem.snippet.resourceId.videoId,
		};

		logger('Fetched latest Short from YouTube API:', JSON.stringify(data));

		await setKV(cacheKey, JSON.stringify(data), {
			expirationTtl: CACHE_TTL_MAP.short,
		});

		return ok(data);
	}

	/**
	 * Gets the latest live stream (or live stream VOD) using the UULV playlist.
	 */
	async #getLatestFromLivePlaylist(
		channelId: string,
		apiKey: string,
		cacheKey: string,
	) {
		const livePlaylistId = channelId.replace(/^UC/, 'UULV');

		const params = new URLSearchParams({
			part: 'snippet',
			playlistId: livePlaylistId,
			maxResults: '1',
			key: apiKey,
		});

		const url = `${this.#baseUrl}/playlistItems?${params.toString()}`;
		logger(url);

		const res = await fetch(url);

		if (!res.ok) {
			logger(`Failed to fetch live playlist: ${res.status} ${res.statusText}`);
			return err(new Error('Failed to fetch live playlist'));
		}

		const json = await res.json();
		const parsed = youtubePlaylistItemsResponseSchema.safeParse(json);

		if (!parsed.success) {
			logger('Failed to parse live playlist response:', parsed.error.message);
			return err(new Error('Failed to parse live playlist response'));
		}

		const firstItem = parsed.data.items[0];
		if (!firstItem) {
			logger(`No lives found for channel ID: ${channelId}`);
			return err(new Error('No lives found for this channel'));
		}

		const data: CachedLatestVideoData = {
			title: firstItem.snippet.title,
			videoId: firstItem.snippet.resourceId.videoId,
		};

		logger('Fetched latest live from YouTube API:', JSON.stringify(data));

		await setKV(cacheKey, JSON.stringify(data), {
			expirationTtl: CACHE_TTL_MAP.live,
		});

		return ok(data);
	}

	/**
	 * Gets the latest long-form video by fetching recent uploads (UULF playlist)
	 * and filtering out Shorts by cross-checking against the UUSH playlist.
	 * Uses search.list as primary and checks against Shorts playlist.
	 */
	async #getLatestLongFormVideo(
		channelId: string,
		apiKey: string,
		cacheKey: string,
	) {
		// Get the long-form videos playlist (UULF prefix)
		const longFormPlaylistId = channelId.replace(/^UC/, 'UULF');

		const params = new URLSearchParams({
			part: 'snippet',
			playlistId: longFormPlaylistId,
			maxResults: '1',
			key: apiKey,
		});

		const url = `${this.#baseUrl}/playlistItems?${params.toString()}`;
		logger(url);

		const res = await fetch(url);

		if (!res.ok) {
			logger(
				`Failed to fetch videos playlist: ${res.status} ${res.statusText}`,
			);
			return err(new Error('Failed to fetch videos playlist'));
		}

		const json = await res.json();
		const parsed = youtubePlaylistItemsResponseSchema.safeParse(json);

		if (!parsed.success) {
			logger('Failed to parse videos playlist response:', parsed.error.message);
			return err(new Error('Failed to parse videos playlist response'));
		}

		const firstItem = parsed.data.items[0];
		if (!firstItem) {
			logger(`No videos found for channel ID: ${channelId}`);
			return err(new Error('No videos found for this channel'));
		}

		const data: CachedLatestVideoData = {
			title: firstItem.snippet.title,
			videoId: firstItem.snippet.resourceId.videoId,
		};

		logger(
			'Fetched latest long-form video from YouTube API:',
			JSON.stringify(data),
		);

		await setKV(cacheKey, JSON.stringify(data), {
			expirationTtl: CACHE_TTL_MAP.video,
		});

		return ok(data);
	}

	/**
	 * Gets the most recent upload regardless of type using search.list.
	 */
	async #getLatestUpload(channelId: string, apiKey: string, cacheKey: string) {
		const searchParams = new URLSearchParams({
			part: 'snippet',
			channelId,
			order: 'date',
			type: 'video',
			maxResults: '1',
			key: apiKey,
		});

		const searchUrl = `${this.#baseUrl}/search?${searchParams.toString()}`;
		logger(searchUrl);

		const searchRes = await fetch(searchUrl);

		if (!searchRes.ok) {
			logger(
				`Failed to fetch from YouTube Search API: ${searchRes.status} ${searchRes.statusText}`,
			);
			return err(new Error('Failed to fetch from YouTube Search API'));
		}

		const searchJson = await searchRes.json();
		const searchParsed = youtubeSearchResponseSchema.safeParse(searchJson);

		if (!searchParsed.success) {
			logger(
				'Failed to parse YouTube Search API response:',
				searchParsed.error.message,
			);
			return err(new Error('Failed to parse YouTube Search API response'));
		}

		const firstItem = searchParsed.data.items[0];
		if (!firstItem) {
			logger(`No videos found for channel ID: ${channelId}`);
			return err(new Error('No videos found for this channel'));
		}

		const data: CachedLatestVideoData = {
			title: firstItem.snippet.title,
			videoId: firstItem.id.videoId,
		};

		logger('Fetched latest upload from YouTube API:', JSON.stringify(data));

		await setKV(cacheKey, JSON.stringify(data), {
			expirationTtl: CACHE_TTL_MAP.any,
		});

		return ok(data);
	}

	async #resolveChannelId(handleOrId: string, apiKey: string) {
		if (handleOrId.startsWith('UC') && handleOrId.length === 24) {
			return ok(handleOrId);
		}

		const handle = handleOrId.startsWith('@') ? handleOrId : `@${handleOrId}`;
		const cacheKey = `social:youtube:resolve-handle:${handle}`;
		const cached = await getKV<string>(cacheKey, 'text');

		if (cached) {
			return ok(cached);
		}

		const params = new URLSearchParams({
			part: 'id',
			forHandle: handle,
			key: apiKey,
		});

		const url = `${this.#baseUrl}/channels?${params.toString()}`;
		logger(url);

		const res = await fetch(url);

		if (!res.ok) {
			logger(`Failed to resolve handle ${handle}: ${res.statusText}`);
			return err(new Error('Failed to resolve handle'));
		}

		const json = await res.json();
		const parsed = youtubeChannelResponseSchema.safeParse(json);

		if (!parsed.success) {
			logger('Failed to parse channels response:', parsed.error.message);
			return err(new Error('Failed to parse channels response'));
		}

		const firstItem = parsed.data.items[0];
		if (!firstItem) {
			logger(`No channel found for handle: ${handle}`);
			return err(new Error('No channel found for this handle'));
		}

		const channelId = firstItem.id;

		await setKV(cacheKey, channelId, {
			expirationTtl: 60 * 60 * 24 * 30, // 30 days
		});

		return ok(channelId);
	}

	formatVideoText(
		title: string,
		videoId: string,
		separator: string,
		omitHashtags = false,
	) {
		const shortUrl = `https://youtu.be/${videoId}`;
		let formattedTitle = title;

		if (omitHashtags) {
			// Remove any hashtag and following text up to a space
			formattedTitle = formattedTitle.replace(/#[^\s#]+/g, '').trim();
		}

		return `${formattedTitle}${separator}${shortUrl}`;
	}
}
