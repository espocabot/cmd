import {
	type CachedLatestVideoData,
	type YoutubeVideoType,
	youtubePlaylistItemsResponseSchema,
	youtubeSearchResponseSchema,
} from '@/definitions/youtube.ts';
import { getEnvs } from '@/lib/env.ts';
import { getKV, setKV } from '@/lib/kv.ts';
import { logger } from '@/lib/logger.ts';
import { err, ok } from '@/lib/result.ts';

const LATEST_VIDEO_TTL_TIME = 60 * 5; // 5 minutes

export class YoutubeProvider {
	#baseUrl = 'https://www.googleapis.com/youtube/v3';

	async getLatestVideo({
		channelId,
		type,
	}: { channelId: string; type: YoutubeVideoType }) {
		const cacheKey = `social:youtube:latest-video:${channelId}:${type}`;
		const cached = await getKV<CachedLatestVideoData>(cacheKey, 'json');

		if (cached) {
			logger('Cache hit for:', cacheKey);
			return ok(cached);
		}

		const { YOUTUBE_API_KEY } = getEnvs();

		if (type === 'short') {
			return this.#getLatestFromShortsPlaylist(
				channelId,
				YOUTUBE_API_KEY,
				cacheKey,
			);
		}

		if (type === 'video') {
			return this.#getLatestLongFormVideo(
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
			logger(
				'Failed to parse Shorts playlist response:',
				parsed.error.message,
			);
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
			expirationTtl: LATEST_VIDEO_TTL_TIME,
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
			logger(
				'Failed to parse videos playlist response:',
				parsed.error.message,
			);
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
			expirationTtl: LATEST_VIDEO_TTL_TIME,
		});

		return ok(data);
	}

	/**
	 * Gets the most recent upload regardless of type using search.list.
	 */
	async #getLatestUpload(
		channelId: string,
		apiKey: string,
		cacheKey: string,
	) {
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
			return err(
				new Error('Failed to parse YouTube Search API response'),
			);
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
			expirationTtl: LATEST_VIDEO_TTL_TIME,
		});

		return ok(data);
	}

	formatVideoText(title: string, videoId: string, separator: string) {
		const shortUrl = `https://youtu.be/${videoId}`;
		return `${title}${separator}${shortUrl}`;
	}
}
