import type { Metadata } from 'next';
import { MarketingPage } from '@/components/marketing/marketing-page';
import { COMPANY_EMAIL, DPO_EMAIL } from '@/lib/legal-content';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Contacte con el equipo LexAI.',
};

export default function ContactoPage() {
  return (
    <MarketingPage
      title="Hablemos"
      subtitle="Soporte técnico, partnerships, prensa y ejercicio de derechos RGPD."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold">Soporte general</h3>
            <a href={`mailto:${COMPANY_EMAIL}`} className="mt-2 block text-lex-accent-gold hover:underline">
              {COMPANY_EMAIL}
            </a>
            <p className="mt-4 text-sm text-lex-text-muted">Respuesta en 24–48 h laborables.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold">Delegado de Protección de Datos</h3>
            <a href={`mailto:${DPO_EMAIL}`} className="mt-2 block text-lex-accent-gold hover:underline">
              {DPO_EMAIL}
            </a>
            <p className="mt-4 text-sm text-lex-text-muted">Acceso, supresión y portabilidad (RGPD).</p>
          </CardContent>
        </Card>
      </div>
    </MarketingPage>
  );
}