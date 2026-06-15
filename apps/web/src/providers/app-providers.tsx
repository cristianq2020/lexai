'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { CookieConsent } from '@/components/legal/cookie-consent';
import { createTrpcClient, trpc } from '@/lib/trpc';

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30_000, retry: 1 },
    },
  }));
  const [trpcClient] = useState(() => createTrpcClient());

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        <CookieConsent />
      </QueryClientProvider>
    </trpc.Provider>
  );
}