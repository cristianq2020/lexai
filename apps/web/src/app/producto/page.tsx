import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingPage } from '@/components/marketing/marketing-page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Producto',
  description: 'Funcionalidades de LexAI: consultas IA, documentos, escritos y voz.',
};

const features = [
  { title: '9 agentes especializados', desc: 'Laboral, civil, penal, familia, fiscal y más — cada uno con prompts y normativa específica.' },
  { title: 'Análisis documental', desc: 'Suba contratos, cartas de despido o denuncias. Semáforo de riesgo y citas legales.' },
  { title: 'Generación de escritos', desc: 'Burofaxes, papeletas, demandas y recursos con versionado y revisión humana opcional.' },
  { title: 'Plazos y alertas', desc: 'Timeline de vencimientos con urgencia crítica para SMAC, recurso, prescripción.' },
  { title: 'Consulta por voz', desc: 'Sesiones LiveKit con transcripción y resumen post-llamada (con consentimiento RGPD).' },
  { title: 'Cumplimiento RGPD', desc: 'Consentimiento granular, exportación Art. 20, eliminación Art. 17 y auditoría completa.' },
];

export default function ProductoPage() {
  return (
    <MarketingPage
      title="Un despacho completo en la nube"
      subtitle="LexAI combina rigor jurídico, IA de última generación y diseño premium para ciudadanos y despachos."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {features.map((f) => (
          <Card key={f.title}>
            <CardHeader>
              <CardTitle className="text-lg">{f.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-lex-text-secondary">{f.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-16 text-center">
        <Button asChild size="lg">
          <Link href="/#demo">Ver demo de 60 segundos</Link>
        </Button>
      </div>
    </MarketingPage>
  );
}