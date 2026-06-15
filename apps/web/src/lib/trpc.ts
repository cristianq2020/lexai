'use client';

import type { AppRouter } from '@lexai/api/trpc';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import superjson from 'superjson';
import { getAuthToken } from './auth-storage';

export const trpc = createTRPCReact<AppRouter>();

export function getBaseUrl(): string {
  if (typeof window !== 'undefined') return '';
  return process.env['API_URL'] ?? 'http://localhost:4000';
}

export function createTrpcClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: `${getBaseUrl()}/api/trpc`,
        transformer: superjson,
        headers() {
          const token = getAuthToken();
          return token ? { Authorization: `Bearer ${token}` } : {};
        },
      }),
    ],
  });
}