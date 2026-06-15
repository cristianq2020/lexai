import type { Metadata } from 'next';
import { MarketingPage } from '@/components/marketing/marketing-page';

export const metadata: Metadata = {
  title: 'Seguridad',
  description: 'Prácticas de seguridad y cumplimiento de LexAI.',
};

const items = [
  { title: 'Cifrado', body: 'TLS 1.3 en tránsito. Documentos con AES-256-GCM y envelope encryption por usuario.' },
  { title: 'Autenticación', body: 'Contraseñas bcrypt (12 rounds). JWT firmados con rotación de secretos.' },
  { title: 'Infraestructura', body: 'Datos en UE. Backups cifrados. Health checks y rate limiting anti-abuso.' },
  { title: 'Auditoría', body: 'Registro inmutable de acciones sensibles con retención de 7 años.' },
  { title: 'IA responsable', body: 'Disclaimers obligatorios. Modo mock sin enviar datos a terceros en desarrollo.' },
];

export default function SeguridadPage() {
  return (
    <MarketingPage
      title="Seguridad y confianza"
      subtitle="Arquitectura diseñada para datos jurídicos sensibles y cumplimiento normativo."
    >
      <ul className="space-y-6">
        {items.map((item) => (
          <li key={item.title} className="rounded-xl border border-white/[0.06] bg-lex-bg-secondary/40 p-6">
            <h3 className="font-display text-xl font-semibold">{item.title}</h3>
            <p className="mt-2 text-lex-text-secondary">{item.body}</p>
          </li>
        ))}
      </ul>
    </MarketingPage>
  );
}