import type { ReactNode } from 'react';

export function Step({ children }: { children: ReactNode }) {
	return <section className="flex flex-col gap-1">{children}</section>;
}

export function StepHeader({ children }: { children: ReactNode }) {
	return <div className="mb-2 flex items-center gap-2">{children}</div>;
}

export function StepOrder({ children }: { children: ReactNode }) {
	return (
		<span className="flex size-6 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-xs">
			{children}
		</span>
	);
}

export function StepTitle({ children }: { children: ReactNode }) {
	return (
		<h2 className="font-semibold text-foreground text-sm uppercase tracking-wide">
			{children}
		</h2>
	);
}
