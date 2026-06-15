import type { Metadata } from 'next';
import { LegalDocument } from '@/components/legal/legal-document';
import { COOKIE_POLICY_SECTIONS, LEGAL_EFFECTIVE_DATE, LEGAL_VERSION } from '@/lib/legal-content';

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description: 'Información sobre el uso de cookies en LexAI.',
};

export default function CookiesPage() {
  return (
    <LegalDocument
      title="Política de Cookies"
      description="Detalle de las cookies y tecnologías similares utilizadas en lexai.es."
      version={LEGAL_VERSION}
      effectiveDate={LEGAL_EFFECTIVE_DATE}
      sections={COOKIE_POLICY_SECTIONS}
    />
  );
}