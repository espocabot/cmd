import { z } from 'zod';

export const youtubeVideoTypeSchema = z
	.union([z.literal('video'), z.literal('short'), z.literal('any')])
	.describe(
		"Filter by content type: 'video' for regular videos, 'short' for YouTube Shorts, 'any' for both",
	);

export type YoutubeVideoType = z.infer<typeof youtubeVideoTypeSchema>;

export const getYoutubeLatestVideoParamsSchema = z.object({
	channel_id: z.string().describe('YouTube channel ID'),
});

export const getYoutubeLatestVideoQuerySchema = z.object({
	type: youtubeVideoTypeSchema
		.optional()
		.default('any')
		.describe(
			"Filter by content type: 'video' for regular videos, 'short' for YouTube Shorts, 'any' for both",
		),
	separator: z
		.string()
		.optional()
		.default(' - ')
		.describe('Separator between the title and the URL in the response'),
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

export const youtubeVideoDetailsResponseSchema = z.object({
	items: z.array(
		z.object({
			id: z.string(),
			contentDetails: z.object({
				duration: z.string().describe('ISO 8601 duration format'),
			}),
			snippet: z.object({
				title: z.string(),
			}),
		}),
	),
});

export type CachedLatestVideoData = {
	title: string;
	videoId: string;
};
