import {
	ArrowRightIcon,
	BoxIcon,
	ClockIcon,
	Gamepad2Icon,
	MusicIcon,
	PlayIcon,
	TvIcon,
	UsersIcon,
} from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { categories } from '@/lib/endpoints';

const iconMap: Record<string, ReactNode> = {
	users: <UsersIcon className="size-5" />,
	'gamepad-2': <Gamepad2Icon className="size-5" />,
	tv: <TvIcon className="size-5" />,
	play: <PlayIcon className="size-5" />,
	music: <MusicIcon className="size-5" />,
	box: <BoxIcon className="size-5" />,
	clock: <ClockIcon className="size-5" />,
};

export function EndpointsSection() {
	return (
		<section className="mx-auto max-w-5xl px-4 py-16">
			<h2 className="mb-8 text-center font-bold text-2xl text-foreground">
				Endpoints disponiveis
			</h2>
			<div className="grid gap-4 sm:grid-cols-2">
				{categories.map((cat) =>
					cat.subcategories.map((sub) => {
						const firstEndpoint = sub.endpoints[0];
						const href = `/docs/${cat.slug}/${sub.slug}/${firstEndpoint?.slug}`;

						return (
							<Link
								key={sub.id}
								href={href}
								className="group flex items-center gap-4 rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-card"
							>
								<span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
									{iconMap[sub.icon]}
								</span>
								<div className="flex flex-1 flex-col gap-0.5">
									<div className="flex items-center gap-2">
										<span className="font-semibold text-foreground text-sm">
											{sub.label}
										</span>
										<span className="text-muted-foreground text-xs">
											{sub.endpoints.length}{' '}
											{sub.endpoints.length === 1 ? 'endpoint' : 'endpoints'}
										</span>
									</div>
									<span className="text-muted-foreground text-xs">
										{sub.endpoints.map((e) => e.title).join(', ')}
									</span>
								</div>
								<ArrowRightIcon className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
							</Link>
						);
					}),
				)}
			</div>
		</section>
	);
}
