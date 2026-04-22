import { errorSchema } from '@/definitions/http-errors.ts';
import { NOT_FOUND, OK } from '@/definitions/http-status-code.ts';
import {
	getYoutubeLatestVideoParamsSchema,
	getYoutubeLatestVideoQuerySchema,
	getYoutubeLatestVideoResponseSchema,
} from '@/definitions/youtube.ts';
import { createRouter } from '@/lib/create-router.ts';
import { isErr } from '@/lib/result.ts';
import { YoutubeProvider } from '@/providers/youtube.ts';

const youtube = createRouter().openapi(
	{
		method: 'get',
		path: '/latest-video/{handle_or_id}',
		summary: 'Get the latest YouTube video',
		tags: ['YouTube'],
		request: {
			params: getYoutubeLatestVideoParamsSchema,
			query: getYoutubeLatestVideoQuerySchema,
		},
		responses: {
			[OK]: {
				description: 'Latest video title and short URL',
				content: {
					'text/plain': {
						schema: getYoutubeLatestVideoResponseSchema,
					},
				},
			},
			[NOT_FOUND]: {
				description: 'Error fetching latest video',
				content: {
					'application/json': {
						schema: errorSchema,
					},
				},
			},
		},
	},
	async (c) => {
		const t = c.get('t');
		const { handle_or_id: handleOrId } = c.req.valid('param');
		const { type, separator, omit_hashtags } = c.req.valid('query');

		const provider = new YoutubeProvider();

		const result = await provider.getLatestVideo({
			handleOrId,
			type,
		});

		if (isErr(result)) {
			return c.json(
				{
					success: false as const,
					error: t('social.youtube.error.latest-video', {
						channelId: handleOrId,
					}),
				},
				NOT_FOUND,
			);
		}

		const { title, videoId } = result.value;

		return c.text(
			provider.formatVideoText(title, videoId, separator, omit_hashtags),
			OK,
		);
	},
);

export { youtube };
