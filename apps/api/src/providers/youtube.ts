import {
	type CachedLatestVideoData,
	type YoutubeVideoType,
	youtubeSearchResponseSchema,
	youtubeVideoDetailsResponseSchema,
} from '@/definitions/youtube.ts';
import { getEnvs } from '@/lib/env.ts';
import { getKV, setKV } from '@/lib/kv.ts';
import { logger } from '@/lib/logger.ts';
import { err, ok } from '@/lib/result.ts';

const LATEST_VIDEO_TTL_TIME = 60 * 5; // 5 minutes
const SHORTS_MAX_DURATION_SECONDS = 60;

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

		const searchParams = new URLSearchParams({
			part: 'snippet',
			channelId,
			order: 'date',
			type: 'video',
			maxResults: type === 'any' ? '1' : '10',
			key: YOUTUBE_API_KEY,
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

		if (!searchParsed.data.items.length) {
			logger(`No videos found for channel ID: ${channelId}`);
			return err(new Error('No videos found for this channel'));
		}

		if (type === 'any') {
			const firstItem = searchParsed.data.items[0];
			if (!firstItem) {
				return err(new Error('No videos found for this channel'));
			}

			const data: CachedLatestVideoData = {
				title: firstItem.snippet.title,
				videoId: firstItem.id.videoId,
			};

			await setKV(cacheKey, JSON.stringify(data), {
				expirationTtl: LATEST_VIDEO_TTL_TIME,
			});

			return ok(data);
		}

		const videoIds = searchParsed.data.items
			.map((item) => item.id.videoId)
			.join(',');

		const detailsParams = new URLSearchParams({
			part: 'contentDetails,snippet',
			id: videoIds,
			key: YOUTUBE_API_KEY,
		});

		const detailsUrl = `${this.#baseUrl}/videos?${detailsParams.toString()}`;
		logger(detailsUrl);

		const detailsRes = await fetch(detailsUrl);

		if (!detailsRes.ok) {
			logger(
				`Failed to fetch video details: ${detailsRes.status} ${detailsRes.statusText}`,
			);
			return err(new Error('Failed to fetch video details'));
		}

		const detailsJson = await detailsRes.json();
		const detailsParsed =
			youtubeVideoDetailsResponseSchema.safeParse(detailsJson);

		if (!detailsParsed.success) {
			logger(
				'Failed to parse video details response:',
				detailsParsed.error.message,
			);
			return err(new Error('Failed to parse video details response'));
		}

		const matchingVideo = detailsParsed.data.items.find((video) => {
			const durationSeconds = this.#parseDuration(
				video.contentDetails.duration,
			);
			return type === 'short'
				? durationSeconds <= SHORTS_MAX_DURATION_SECONDS
				: durationSeconds > SHORTS_MAX_DURATION_SECONDS;
		});

		if (!matchingVideo) {
			const label = type === 'short' ? 'Shorts' : 'videos';
			logger(`No ${label} found for channel ID: ${channelId}`);
			return err(new Error(`No ${label} found for this channel`));
		}

		const data: CachedLatestVideoData = {
			title: matchingVideo.snippet.title,
			videoId: matchingVideo.id,
		};

		logger('Fetched latest video from YouTube API:', JSON.stringify(data));

		await setKV(cacheKey, JSON.stringify(data), {
			expirationTtl: LATEST_VIDEO_TTL_TIME,
		});

		return ok(data);
	}

	formatVideoText(title: string, videoId: string, separator: string) {
		const shortUrl = `https://youtu.be/${videoId}`;
		return `${title}${separator}${shortUrl}`;
	}

	#parseDuration(isoDuration: string): number {
		const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
		if (!match) return 0;

		const hours = Number.parseInt(match[1] || '0', 10);
		const minutes = Number.parseInt(match[2] || '0', 10);
		const seconds = Number.parseInt(match[3] || '0', 10);

		return hours * 3600 + minutes * 60 + seconds;
	}
}
