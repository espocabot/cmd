import { BookOpenIcon } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';

export function HeaderSection() {
	return (
		<nav className="sticky top-0 border-border border-b bg-background/60 backdrop-blur-md">
			<div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
				<Logo />
				<Button asChild size="sm" variant="outline">
					<Link href="/docs">
						<BookOpenIcon className="size-4" />
						Documentação
					</Link>
				</Button>
			</div>
		</nav>
	);
}
