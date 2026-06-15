'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = trpc.admin.getDashboardStats.useQuery();

  if (isLoading) {
    return <p className="text-lex-text-muted">Cargando métricas…</p>;
  }

  const cards = [
    { label: 'Usuarios', value: stats?.users ?? 0 },
    { label: 'Expedientes activos', value: stats?.activeCases ?? 0 },
    { label: 'Consultas', value: stats?.consultations ?? 0 },
    { label: 'Auditoría (24h)', value: stats?.auditLogs24h ?? 0 },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Panel de administración</h1>
      <p className="mt-2 text-lex-text-secondary">Vista global del sistema LexAI</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-lex-text-muted">{c.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display text-3xl font-bold">{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {stats?.planBreakdown && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Distribución por plan</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {stats.planBreakdown.map((p) => (
                <li key={p.plan} className="flex justify-between text-sm">
                  <span>{p.plan}</span>
                  <span className="font-medium">{p.count}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}