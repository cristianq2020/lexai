import type { Metadata } from 'next';
import { MarketingPage } from '@/components/marketing/marketing-page';
import { COMPANY_NAME, COMPANY_ADDRESS } from '@/lib/legal-content';

export const metadata: Metadata = {
  title: 'Empresa',
  description: 'Misión y valores de LexAI.',
};

export default function EmpresaPage() {
  return (
    <MarketingPage
      title="Justicia accesible, tecnología responsable"
      subtitle={`${COMPANY_NAME} nace para cerrar la brecha entre el derecho de élite y las personas que más lo necesitan.`}
    >
      <div className="prose prose-invert mx-auto max-w-none space-y-8 text-lex-text-secondary">
        <section className="rounded-2xl border border-white/[0.06] bg-lex-bg-secondary/40 p-8">
          <h2 className="font-display text-2xl font-semibold text-lex-text-primary">Nuestra misión</h2>
          <p className="mt-4 leading-relaxed">
            Democratizar el acceso a orientación jurídica de calidad mediante IA especializada,
            siempre con transparencia, disclaimers legales y supervisión humana cuando el caso lo exige.
          </p>
        </section>
        <section className="rounded-2xl border border-white/[0.06] bg-lex-bg-secondary/40 p-8">
          <h2 className="font-display text-2xl font-semibold text-lex-text-primary">Valores</h2>
          <ul className="mt-4 list-inside list-disc space-y-2">
            <li><strong className="text-lex-text-primary">Rigor:</strong> análisis IRAC y citas normativas verificables.</li>
            <li><strong className="text-lex-text-primary">Privacidad:</strong> cifrado AES-256, RGPD by design.</li>
            <li><strong className="text-lex-text-primary">Accesibilidad:</strong> planes desde €0 para consultas básicas.</li>
          </ul>
        </section>
        <p className="text-center text-sm text-lex-text-muted">{COMPANY_ADDRESS}</p>
      </div>
    </MarketingPage>
  );
}