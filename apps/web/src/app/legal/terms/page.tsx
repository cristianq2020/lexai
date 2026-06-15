import type { Metadata } from 'next';
import { LegalDocument } from '@/components/legal/legal-document';
import { LEGAL_EFFECTIVE_DATE, LEGAL_VERSION, TERMS_SECTIONS } from '@/lib/legal-content';

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description: 'Términos de uso del servicio LexAI.',
};

export default function TermsPage() {
  return (
    <LegalDocument
      title="Términos y Condiciones"
      description="Condiciones generales de contratación y uso de la plataforma LexAI."
      version={LEGAL_VERSION}
      effectiveDate={LEGAL_EFFECTIVE_DATE}
      sections={TERMS_SECTIONS}
    />
  );
}