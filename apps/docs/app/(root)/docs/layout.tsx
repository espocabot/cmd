import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { DocsSidebar } from './_components/docs-sidebar';

export default function DocsLayout({ children }: LayoutProps<'/docs'>) {
	return (
		<SidebarProvider>
			<DocsSidebar />
			<SidebarInset>
				<main className="flex-1 overflow-x-hidden">
					<div className="mx-auto max-w-4xl px-4 py-8 pb-20 lg:px-8">
						{children}
					</div>
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
