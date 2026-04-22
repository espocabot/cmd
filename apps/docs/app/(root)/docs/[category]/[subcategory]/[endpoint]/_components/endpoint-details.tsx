'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface EndpointDetailsProps {
	method: string;
	url: string;
}

export function EndpointDetails({ method, url }: EndpointDetailsProps) {
	const [open, setOpen] = useState(false);

	return (
		<Collapsible open={open} onOpenChange={setOpen}>
			<CollapsibleTrigger className="flex w-full items-center gap-2 rounded-lg border border-border bg-secondary/50 px-4 py-3 text-muted-foreground text-sm transition-colors hover:text-foreground">
				<ChevronDown
					className={cn(
						'size-4 shrink-0 transition-transform',
						open && 'rotate-180',
					)}
				/>
				<span>Ver detalhes técnicos</span>
			</CollapsibleTrigger>
			<CollapsibleContent className="mt-2 rounded-lg border border-border bg-secondary/50 p-4">
				<div className="flex flex-col gap-3">
					<div className="flex items-center gap-2">
						<span className="text-muted-foreground text-xs">Método:</span>
						<Badge
							variant="secondary"
							className="bg-primary/10 font-mono text-primary text-xs"
						>
							{method}
						</Badge>
					</div>
					<div className="flex flex-col gap-1">
						<span className="text-muted-foreground text-xs">Endpoint:</span>
						<code className="break-all rounded-md bg-background p-2 font-mono text-foreground text-xs">
							{url}
						</code>
					</div>
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}
