'use client';

import { HeartHandshakeIcon, SearchIcon, SparklesIcon } from 'lucide-react';
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';

const items = [
	{
		title: 'Search',
		url: '#',
		icon: SearchIcon,
		isActive: true,
	},
	{
		title: 'Ask AI',
		url: '#',
		icon: SparklesIcon,
	},
	{
		title: 'Contribuição',
		url: '#',
		icon: HeartHandshakeIcon,
	},
];

export function NavMain() {
	return (
		<SidebarGroup>
			<SidebarMenu>
				{items.map((item) => (
					<SidebarMenuItem key={item.title}>
						<SidebarMenuButton asChild isActive={item.isActive}>
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
