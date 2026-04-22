'use client';

import {
	BoxIcon,
	Clock2Icon,
	Gamepad2Icon,
	MusicIcon,
	PlayIcon,
	TvIcon,
	UsersIcon,
	type LucideIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import { categories } from '@/lib/endpoints';
import { logos } from '@/lib/logos';

const iconMap: Record<string, LucideIcon> = {
	users: UsersIcon,
	'gamepad-2': Gamepad2Icon,
	tv: TvIcon,
	play: PlayIcon,
	music: MusicIcon,
	box: BoxIcon,
	clock: Clock2Icon,
};

export function NavEndpoints() {
	const pathname = usePathname();

	return (
		<SidebarGroup className="*:data-[sidebar=menu]:mb-2">
			{categories.map((category) => (
				<Fragment key={category.id}>
					<SidebarGroupLabel>{category.label}</SidebarGroupLabel>
					<SidebarMenu>
						{category.subcategories.map((subcategory) => {
							const IconComponent = iconMap[subcategory.icon];
							const isLogo = !!logos[subcategory.slug];

							// Auto-open the collapsible if the current route is within this subcategory
							const isActive = pathname.includes(
								`/docs/${category.slug}/${subcategory.slug}`,
							);

							return (
								<Collapsible
									key={subcategory.id}
									asChild
									defaultOpen={isActive}
									className="group/collapsible"
								>
									<SidebarMenuItem>
										<CollapsibleTrigger asChild>
											<SidebarMenuButton tooltip={subcategory.label}>
												{isLogo ? (
													<Image
														src={
															logos[subcategory.slug]?.dark ??
															logos[subcategory.slug]?.light ??
															''
														}
														width={16}
														height={16}
														alt={`${subcategory.label} logo`}
													/>
												) : IconComponent ? (
													<IconComponent />
												) : null}
												<span>{subcategory.label}</span>
											</SidebarMenuButton>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<SidebarMenuSub>
												{subcategory.endpoints?.map((endpoint) => {
													const href = `/docs/${category.slug}/${subcategory.slug}/${endpoint.slug}`;
													const isEndpointActive = pathname === href;

													return (
														<SidebarMenuSubItem key={endpoint.id}>
															<SidebarMenuSubButton
																asChild
																isActive={isEndpointActive}
															>
																<Link href={href}>
																	<span>{endpoint.title}</span>
																</Link>
															</SidebarMenuSubButton>
														</SidebarMenuSubItem>
													);
												})}
											</SidebarMenuSub>
										</CollapsibleContent>
									</SidebarMenuItem>
								</Collapsible>
							);
						})}
					</SidebarMenu>
				</Fragment>
			))}
		</SidebarGroup>
	);
}
