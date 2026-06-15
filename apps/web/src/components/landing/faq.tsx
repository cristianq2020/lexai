'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { BASE_DISCLAIMER } from '@lexai/shared';

const faqs = [
  {
    q: '¿LexAI sustituye a un abogado?',
    a: 'No. LexAI proporciona orientación jurídica general con rigor profesional, pero no establece relación abogado-cliente vinculante. Para decisiones críticas, consulte un abogado colegiado.',
  },
  {
    q: '¿Qué legislación cubre?',
    a: 'Legislación española como base, con adaptaciones para LatAm. 9 áreas: laboral, civil, penal, familia, fiscal, tráfico, consumidor, mercantil y extranjería.',
  },
  {
    q: '¿Mis datos están seguros?',
    a: 'Sí. Cifrado AES-256-GCM, cumplimiento RGPD, consentimiento granular y expedientes cifrados por usuario.',
  },
  {
    q: '¿Puedo generar escritos legales?',
    a: 'Sí, en planes Pro y Enterprise. Burofaxes, cartas de despido, recursos, contratos y más — listos para revisión y firma.',
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-12 text-center font-display text-3xl font-bold">Preguntas frecuentes</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={faq.q}
              className="rounded-xl border border-white/[0.08] bg-lex-bg-secondary/50"
            >
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between p-5 text-left font-medium"
                aria-expanded={open === i}
              >
                {faq.q}
                <span className="text-lex-accent-gold">{open === i ? '−' : '+'}</span>
              </button>
              <div
                className={cn(
                  'overflow-hidden transition-all',
                  open === i ? 'max-h-48 pb-5' : 'max-h-0',
                )}
              >
                <p className="px-5 text-sm text-lex-text-secondary">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-lex-risk-medium/20 bg-lex-risk-medium/5 p-6">
          <p className="text-xs leading-relaxed text-lex-text-muted">
            <strong className="text-lex-risk-medium">Aviso legal:</strong> {BASE_DISCLAIMER}
          </p>
        </div>
      </div>
    </section>
  );
}