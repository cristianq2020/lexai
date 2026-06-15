'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getAuthToken } from '@/lib/auth-storage';
import { trpc } from '@/lib/trpc';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = typeof window !== 'undefined' ? getAuthToken() : null;
  const { data: user, isLoading, isError } = trpc.auth.me.useQuery(undefined, {
    enabled: Boolean(token),
    retry: false,
  });

  useEffect(() => {
    if (!token) {
      router.replace('/login');
      return;
    }
    if (!isLoading && (isError || !user)) {
      router.replace('/login');
    }
  }, [token, isLoading, isError, user, router]);

  if (!token || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-lex-text-muted">
        Cargando…
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: user, isLoading } = trpc.auth.me.useQuery();

  useEffect(() => {
    if (!isLoading && user?.role !== 'ADMIN') {
      router.replace('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading || user?.role !== 'ADMIN') {
    return (
      <div className="flex min-h-screen items-center justify-center text-lex-text-muted">
        Verificando permisos…
      </div>
    );
  }

  return <>{children}</>;
}