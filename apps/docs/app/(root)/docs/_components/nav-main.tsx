'use client';

import { BookOpenIcon, HeartHandshakeIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';

const items = [
	{
		title: 'Introdução',
		url: '/docs',
		icon: BookOpenIcon,
	},
	{
		title: 'Contribuição',
		url: '/docs/contributing',
		icon: HeartHandshakeIcon,
	},
];

export function NavMain() {
	const pathname = usePathname();

	return (
		<SidebarGroup>
			<SidebarMenu>
				{items.map((item) => (
					<SidebarMenuItem key={item.title}>
						<SidebarMenuButton asChild isActive={pathname === item.url}>
							<a href={item.url}>
								<item.icon />
								<span>{item.title}</span>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
