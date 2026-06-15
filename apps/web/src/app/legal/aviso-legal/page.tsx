import type { Metadata } from 'next';
import { LegalDocument } from '@/components/legal/legal-document';
import { LEGAL_EFFECTIVE_DATE, LEGAL_NOTICE_SECTIONS, LEGAL_VERSION } from '@/lib/legal-content';

export const metadata: Metadata = {
  title: 'Aviso Legal',
  description: 'Aviso legal e información del titular de LexAI.',
};

export default function AvisoLegalPage() {
  return (
    <LegalDocument
      title="Aviso Legal"
      description="Información legal del titular del sitio web conforme a la LSSI-CE."
      version={LEGAL_VERSION}
      effectiveDate={LEGAL_EFFECTIVE_DATE}
      sections={LEGAL_NOTICE_SECTIONS}
    />
  );
}