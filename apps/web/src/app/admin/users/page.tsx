'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/lib/trpc';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.admin.listUsers.useQuery({ search: search || undefined, limit: 50 });

  const setActive = trpc.admin.setUserActive.useMutation({
    onSuccess: () => utils.admin.listUsers.invalidate(),
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Usuarios</h1>
      <Input
        className="mt-6 max-w-md"
        placeholder="Buscar por email o nombre…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {isLoading ? (
        <p className="mt-8 text-lex-text-muted">Cargando…</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-white/[0.06]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/[0.06] bg-lex-bg-secondary/50 text-lex-text-muted">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Expedientes</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data?.users.map((u) => (
                <tr key={u.id} className="border-b border-white/[0.04]">
                  <td className="px-4 py-3">
                    <p className="font-medium">{u.email}</p>
                    <p className="text-xs text-lex-text-muted">{u.name}</p>
                  </td>
                  <td className="px-4 py-3">{u.plan}</td>
                  <td className="px-4 py-3">
                    {u.role === 'ADMIN' ? (
                      <Badge className="bg-lex-accent-gold/20 text-lex-accent-gold">ADMIN</Badge>
                    ) : (
                      u.role
                    )}
                  </td>
                  <td className="px-4 py-3">{u._count.cases}</td>
                  <td className="px-4 py-3">
                    <Badge variant={u.isActive ? 'success' : 'danger'}>
                      {u.isActive ? 'Activo' : 'Suspendido'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {u.role !== 'ADMIN' && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={setActive.isPending}
                        onClick={() =>
                          setActive.mutate({ userId: u.id, isActive: !u.isActive })
                        }
                      >
                        {u.isActive ? 'Suspender' : 'Activar'}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}