import { BookOpenIcon } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { categories } from '@/lib/endpoints';

const totalEndpoints = categories.reduce(
	(acc, cat) =>
		acc + cat.subcategories.reduce((a, sub) => a + sub.endpoints.length, 0),
	0,
);

export function HeroSection() {
	return (
		<section className="mx-auto max-w-5xl px-4 py-16 lg:py-24">
			<div className="flex flex-col items-center gap-6 text-center">
				<Badge
					variant="secondary"
					className="bg-primary/10 font-mono text-primary text-sm"
				>
					{totalEndpoints} endpoints disponiveis
				</Badge>
				<h1 className="text-balance font-bold text-4xl text-foreground lg:text-5xl">
					Comandos para sua live,
					<br />
					<span className="text-primary">sem complicacao</span>
				</h1>
				<p className="max-w-xl text-pretty text-lg text-muted-foreground leading-relaxed">
					Gere comandos prontos para Nightbot, StreamElements, Botrix e outros.
					Preencha os campos, copie e cole. Sem precisar entender de
					programação.
				</p>
				<div className="flex items-center gap-3">
					<Button asChild size="lg">
						<Link href="/docs">
							<BookOpenIcon className="mr-2 size-5" />
							Ver Documentação
						</Link>
					</Button>
				</div>
			</div>
		</section>
	);
}
