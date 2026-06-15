'use client';

import { Download, FileOutput } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const DEMO_ESCRITOS = [
  { id: '1', title: 'Carta de despido improcedente', type: 'CARTA_DESPIDO', version: 2, date: '12 jun 2026' },
  { id: '2', title: 'Recurso de multa de tráfico', type: 'RECURSO_MULTA', version: 1, date: '10 jun 2026' },
  { id: '3', title: 'Solicitud de residencia', type: 'SOLICITUD_NACIONALIDAD', version: 1, date: '8 jun 2026' },
];

export default function EscritosPage() {
  return (
    <main className="p-8">
      <h1 className="mb-2 font-display text-3xl font-bold">Escritos generados</h1>
      <p className="mb-8 text-lex-text-secondary">
        Documentos legales redactados por LexAI, listos para revisión y firma.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {DEMO_ESCRITOS.map((escrito) => (
          <Card key={escrito.id}>
            <CardHeader className="flex flex-row items-start gap-4">
              <FileOutput className="shrink-0 text-lex-accent-gold" size={28} aria-hidden />
              <div className="flex-1">
                <CardTitle className="text-base">{escrito.title}</CardTitle>
                <div className="mt-2 flex gap-2">
                  <Badge variant="gold">{escrito.type.replace(/_/g, ' ')}</Badge>
                  <Badge>v{escrito.version}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-xs text-lex-text-muted">Generado el {escrito.date}</p>
              <div className="rounded-xl border border-white/[0.06] bg-lex-bg-primary p-4 text-xs text-lex-text-secondary">
                <p className="font-semibold text-lex-text-primary">Vista previa</p>
                <p className="mt-2">
                  D./Dña. [NOMBRE], con DNI [XXX], ante el órgano competente comparece y DICE:…
                </p>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="secondary" size="sm" disabled>
                  <Download size={14} aria-hidden />
                  PDF
                </Button>
                <Button variant="ghost" size="sm">Ver historial</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}