import { Link } from 'lucide-react';
import { Logo } from '@/components/logo';

export function DocsHeader() {
	return (
		<nav className="sticky top-0 z-30 border-border border-b bg-background/80 backdrop-blur-md">
			<div className="flex items-center justify-between px-4 py-3 lg:px-6">
				<div className="flex items-center gap-3">
					<Link href="/" className="flex items-center gap-2">
						<Logo />
					</Link>
					<span className="hidden rounded-full bg-primary/10 px-3 py-1 font-medium text-primary text-xs sm:inline-flex">
						Documentacao da API
					</span>
				</div>
			</div>
		</nav>
	);
}
