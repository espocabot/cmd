'use client';

import { Clock2Icon, type LucideIcon } from 'lucide-react';
import Image from 'next/image';
import { Fragment } from 'react';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { logos } from '@/lib/logos';

type Endpoint = {
	title: string;
	url: string;
};

type Subcategory = {
	id: string;
	title: string;
	type: 'logo' | 'icon';
	icon?: LucideIcon;
	endpoints: Endpoint[];
};

type Category = {
	title: string;
	subcategories: Subcategory[];
};

const categories: Category[] = [
	{
		title: 'Social',
		subcategories: [
			{
				title: 'Tiktok',
				type: 'logo',
				id: 'tiktok',
				endpoints: [],
			},
			{
				title: 'Youtube',
				type: 'logo',
				id: 'youtube',
				endpoints: [
					{
						title: 'Último vídeo',
						url: '#',
					},
					{
						title: 'Último shorts',
						url: '#',
					},
				],
			},
			{
				title: 'Steam',
				type: 'logo',
				id: 'steam',
				endpoints: [
					{
						title: 'Horas jogadas',
						url: '#',
					},
				],
			},
		],
	},
	{
		title: 'Games',
		subcategories: [
			{
				title: 'Dead by Daylight',
				type: 'logo',
				id: 'dead-by-daylight',
				endpoints: [],
			},
		],
	},
	{
		title: 'Miscelaneous',
		subcategories: [
			{
				title: 'Data e hora',
				id: 'datetime',
				type: 'icon',

				icon: Clock2Icon,
				endpoints: [
					{
						title: 'Contagem regressiva',
						url: '#',
					},
					{
						title: 'Data e hora',
						url: '#',
					},
				],
			},
		],
	},
];

export function NavEndpoints() {
	return (
		<SidebarGroup className="*:data-[sidebar=menu]:mb-2">
			{categories.map((category) => (
				<Fragment key={category.title}>
					<SidebarGroupLabel>{category.title}</SidebarGroupLabel>
					<SidebarMenu>
						{category.subcategories.map((subcategory) => (
							<Collapsible
								key={subcategory.title}
								asChild
								// defaultOpen={subcategory?.isActive}
								className="group/collapsible"
							>
								<SidebarMenuItem>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton tooltip={subcategory.title}>
											{subcategory.type === 'logo' ? (
												<Image
													src={
														logos[subcategory.id]?.dark ??
														logos[subcategory.id]?.light ??
														''
													}
													width={16}
													height={16}
													alt={`${subcategory.title} logo`}
												/>
											) : null}
											{subcategory.icon ? <subcategory.icon /> : null}
											<span>{subcategory.title}</span>
										</SidebarMenuButton>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub>
											{subcategory.endpoints?.map((endpoint) => (
												<SidebarMenuSubItem key={endpoint.title}>
													<SidebarMenuSubButton asChild>
														<a href={endpoint.url}>
															<span>{endpoint.title}</span>
														</a>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									</CollapsibleContent>
								</SidebarMenuItem>
							</Collapsible>
						))}
					</SidebarMenu>
				</Fragment>
			))}
		</SidebarGroup>
	);
}
