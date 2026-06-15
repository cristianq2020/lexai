import type { Metadata } from 'next';
import { LegalDocument } from '@/components/legal/legal-document';
import { LEGAL_EFFECTIVE_DATE, LEGAL_VERSION, PRIVACY_SECTIONS } from '@/lib/legal-content';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad y protección de datos RGPD de LexAI.',
};

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Política de Privacidad"
      description="Información sobre cómo LexAI trata sus datos personales conforme al Reglamento (UE) 2016/679 (RGPD) y la LOPDGDD."
      version={LEGAL_VERSION}
      effectiveDate={LEGAL_EFFECTIVE_DATE}
      sections={PRIVACY_SECTIONS}
    />
  );
}