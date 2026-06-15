'use client';

import { trpc } from '@/lib/trpc';

export default function AdminAuditPage() {
  const { data, isLoading } = trpc.admin.listAuditLogs.useQuery({ limit: 100 });

  if (isLoading) {
    return <p className="text-lex-text-muted">Cargando auditoría…</p>;
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Registro de auditoría</h1>
      <p className="mt-2 text-lex-text-secondary">Últimas 100 acciones del sistema</p>

      <div className="mt-8 space-y-2">
        {data?.logs.map((log) => (
          <div
            key={log.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/[0.06] px-4 py-3 text-sm"
          >
            <div>
              <span className="font-medium text-lex-accent-gold">{log.action}</span>
              <span className="mx-2 text-lex-text-muted">·</span>
              <span>{log.resource}</span>
              {log.resourceId && (
                <span className="ml-2 text-xs text-lex-text-muted">{log.resourceId}</span>
              )}
            </div>
            <div className="text-xs text-lex-text-muted">
              {log.user?.email ?? 'sistema'} · {new Date(log.createdAt).toLocaleString('es-ES')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}