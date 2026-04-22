'use client';

import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { SWRConfig } from 'swr';
import { httpClient } from '@/lib/http-client';
import { Toaster } from './ui/sonner';
import { TooltipProvider } from './ui/tooltip';

export function Providers({ children }: { children: ReactNode }) {
	return (
		<SWRConfig
			value={{
				suspense: true,
				fetcher: (resource, init) =>
					httpClient(resource, {
						...init,
						headers: { Accept: 'text/plain' },
					}).then((res) => res.text()),
				onError(err) {
					if (err.status === 401) {
						redirect('/auth');
					}
				},
			}}
		>
			<TooltipProvider>
				{children}
				<Toaster />
			</TooltipProvider>
		</SWRConfig>
	);
}
