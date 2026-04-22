import { z } from 'zod';

export const youtubeVideoTypeSchema = z
	.union([
		z.literal('video'),
		z.literal('short'),
		z.literal('live'),
		z.literal('any'),
	])
	.describe(
		"Filter by content type: 'video' for regular videos, 'short' for YouTube Shorts, 'live' for live streams, 'any' for all types",
	);

export type YoutubeVideoType = z.infer<typeof youtubeVideoTypeSchema>;

export const getYoutubeLatestVideoParamsSchema = z.object({
	handle_or_id: z
		.string()
		.describe('YouTube channel ID or handle (e.g. @MrBeast)'),
});

export const getYoutubeLatestVideoQuerySchema = z.object({
	type: youtubeVideoTypeSchema
		.optional()
		.default('any')
		.describe(
			"Filter by content type: 'video' for regular videos, 'short' for YouTube Shorts, 'live' for live streams, 'any' for all types",
		),
	separator: z
		.string()
		.optional()
		.default(' - ')
		.describe('Separator between the title and the URL in the response'),
	omit_hashtags: z
		.enum(['true', 'false'])
		.default('false')
		.transform((val) => val === 'true')
		.describe('If true, removes any hashtags from the video title'),
});

export const getYoutubeLatestVideoResponseSchema = z
	.string()
	.describe(
		'Text response with the latest video title, a separator, and the short YouTube URL',
	);

export const youtubeSearchResponseSchema = z.object({
	items: z.array(
		z.object({
			id: z.object({
				videoId: z.string(),
			}),
			snippet: z.object({
				title: z.string(),
				publishedAt: z.string(),
			}),
		}),
	),
});

export const youtubePlaylistItemsResponseSchema = z.object({
	items: z.array(
		z.object({
			snippet: z.object({
				title: z.string(),
				publishedAt: z.string(),
				resourceId: z.object({
					videoId: z.string(),
				}),
			}),
		}),
	),
});

export const youtubeChannelResponseSchema = z.object({
	items: z.array(
		z.object({
			id: z.string(),
		}),
	),
});

export type CachedLatestVideoData = {
	title: string;
	videoId: string;
};
