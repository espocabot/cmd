import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
	categories,
	findEndpointByPath,
	getAllEndpoints,
} from '@/lib/endpoints';
import { CommandGenerator } from './_components/command-generator';

export async function generateStaticParams() {
	return getAllEndpoints().map(({ category, subcategory, endpoint }) => ({
		category: category.slug,
		subcategory: subcategory.slug,
		endpoint: endpoint.slug,
	}));
}

export async function generateMetadata({
	params,
}: PageProps<'/docs/[category]/[subcategory]/[endpoint]'>): Promise<Metadata> {
	const { category, subcategory, endpoint: endpointSlug } = await params;
	const ep = findEndpointByPath(category, subcategory, endpointSlug);
	if (!ep) return { title: 'Endpoint nao encontrado - espoca.bot' };

	const cat = categories.find((c) => c.slug === category);
	const sub = cat?.subcategories.find((s) => s.slug === subcategory);

	return {
		title: `${ep.title} (${sub?.label}) - espoca.bot`,
		description: ep.description,
	};
}

export default async function EndpointPage({
	params,
}: PageProps<'/docs/[category]/[subcategory]/[endpoint]'>) {
	const { category, subcategory, endpoint: endpointSlug } = await params;
	const ep = findEndpointByPath(category, subcategory, endpointSlug);

	if (!ep) {
		notFound();
	}

	const cat = categories.find((c) => c.slug === category);
	const sub = cat?.subcategories.find((s) => s.slug === subcategory);

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-1.5 text-muted-foreground text-xs">
				<span>{cat?.label}</span>
				<span className="text-muted-foreground/50">/</span>
				<span>{sub?.label}</span>
				<span className="text-muted-foreground/50">/</span>
				<span className="font-medium text-foreground">{ep.title}</span>
			</div>

			<CommandGenerator endpoint={ep} />
		</div>
	);
}
