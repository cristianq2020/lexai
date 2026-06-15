'use client';

import { Download, Shield, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { clearAuthToken } from '@/lib/auth-storage';
import { trpc } from '@/lib/trpc';

export default function SettingsPage() {
  const router = useRouter();
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  const { data: user } = trpc.auth.me.useQuery();
  const { data: retentionPolicy } = trpc.compliance.getRetentionPolicy.useQuery();
  const { data: consents } = trpc.compliance.getConsents.useQuery();

  const exportData = trpc.compliance.exportUserData.useMutation({
    onSuccess: (data) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `lexai-export-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      setExportStatus('Exportación completada');
    },
    onError: () => setExportStatus('Error al exportar datos'),
  });

  const deleteAccount = trpc.compliance.deleteAccount.useMutation({
    onSuccess: () => {
      clearAuthToken();
      router.push('/');
    },
  });

  const grantedConsents = consents?.filter((c) => c.granted).map((c) => c.type) ?? [];

  return (
    <main className="p-8">
      <h1 className="mb-8 font-display text-3xl font-bold">Ajustes</h1>
      <div className="max-w-xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-lex-text-muted">Email:</span> {user?.email}
            </p>
            <p>
              <span className="text-lex-text-muted">Plan:</span> {user?.plan}
            </p>
            <p>
              <span className="text-lex-text-muted">Idioma:</span> {user?.locale}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield size={18} aria-hidden />
              Privacidad y RGPD
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="text-lex-text-muted">Consentimientos activos</p>
              <p className="mt-1">
                {grantedConsents.length > 0
                  ? grantedConsents.join(', ')
                  : 'Sin consentimientos registrados'}
              </p>
            </div>

            {retentionPolicy && (
              <div>
                <p className="text-lex-text-muted">Política de retención (v{retentionPolicy.version})</p>
                <ul className="mt-2 space-y-1 text-xs text-lex-text-secondary">
                  {retentionPolicy.rules.map((rule) => (
                    <li key={rule.dataType}>
                      {rule.dataType}: {rule.retentionDays} días — {rule.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportData.mutate()}
                disabled={exportData.isPending}
              >
                <Download size={16} aria-hidden />
                {exportData.isPending ? 'Exportando…' : 'Exportar mis datos (Art. 20)'}
              </Button>
              {exportStatus && (
                <span className="self-center text-xs text-lex-text-muted">{exportStatus}</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-lex-risk-high/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lex-risk-high">
              <Trash2 size={18} aria-hidden />
              Zona de peligro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="text-lex-text-secondary">
              Eliminar su cuenta borrará en cascada todos sus expedientes, consultas, documentos
              cifrados y registros asociados (RGPD Art. 17 — derecho al olvido). Esta acción es
              irreversible.
            </p>
            <Input
              placeholder='Escriba "ELIMINAR MI CUENTA" para confirmar'
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
            />
            <Button
              variant="destructive"
              size="sm"
              disabled={
                deleteConfirmation !== 'ELIMINAR MI CUENTA' || deleteAccount.isPending
              }
              onClick={() =>
                deleteAccount.mutate({ confirmation: 'ELIMINAR MI CUENTA' })
              }
            >
              {deleteAccount.isPending ? 'Eliminando…' : 'Eliminar cuenta permanentemente'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Facturación</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-lex-text-muted">Portal de cliente Stripe — próximamente</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}