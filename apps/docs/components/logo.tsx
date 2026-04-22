import { CommandIcon } from 'lucide-react';

export function Logo() {
	return (
		<div className="flex items-center gap-2">
			<div className="flex size-8 items-center justify-center rounded-lg bg-primary">
				<CommandIcon className="size-4 text-primary-foreground" />
			</div>
			<span className="font-bold text-foreground text-sm">
				CMD Api | EspocaBot
			</span>
		</div>
	);
}
