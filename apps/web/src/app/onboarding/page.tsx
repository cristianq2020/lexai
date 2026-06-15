'use client';

import { LEGAL_AREAS, type LegalAreaId } from '@lexai/shared';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ShieldCheck, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { trpc } from '@/lib/trpc';

const PRISMA_AREA_MAP: Record<LegalAreaId, string> = {
  laboral: 'LABORAL',
  civil: 'CIVIL',
  penal: 'PENAL',
  familia: 'FAMILIA',
  fiscal: 'FISCAL',
  trafico: 'TRAFICO',
  consumidor: 'CONSUMIDOR',
  mercantil: 'MERCANTIL',
  extranjeria: 'EXTRANJERIA',
};

const steps = ['Consentimiento', 'Área jurídica', 'Descripción', 'Documento'];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [area, setArea] = useState<LegalAreaId | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [consents, setConsents] = useState({
    termsOfService: false,
    privacyPolicy: false,
    aiProcessing: false,
    analyticsCookies: false,
  });

  const recordConsents = trpc.compliance.recordConsents.useMutation();

  const createCase = trpc.cases.create.useMutation({
    onSuccess: (data) => {
      router.push(`/dashboard/chat/${data.id}`);
    },
  });

  const handleFinish = async () => {
    if (!area || !title) return;

    await recordConsents.mutateAsync({
      termsOfService: consents.termsOfService,
      privacyPolicy: consents.privacyPolicy,
      aiProcessing: consents.aiProcessing,
      analyticsCookies: consents.analyticsCookies,
    });

    createCase.mutate({
      title,
      ...(description ? { description } : {}),
      legalArea: PRISMA_AREA_MAP[area] as
        | 'LABORAL'
        | 'CIVIL'
        | 'PENAL'
        | 'FAMILIA'
        | 'FISCAL'
        | 'TRAFICO'
        | 'CONSUMIDOR'
        | 'MERCANTIL'
        | 'EXTRANJERIA',
    });
  };

  const consentComplete =
    consents.termsOfService && consents.privacyPolicy && consents.aiProcessing;

  const isPending = recordConsents.isPending || createCase.isPending;

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-12">
      <div className="mb-12">
        <div className="mb-4 flex justify-between text-sm text-lex-text-muted">
          {steps.map((s, i) => (
            <span key={s} className={cn(i <= step && 'text-lex-accent-gold font-medium')}>
              {i + 1}. {s}
            </span>
          ))}
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-lex-bg-elevated">
          <motion.div
            className="h-full bg-lex-accent-gold"
            animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1"
          >
            <div className="mb-4 flex items-center gap-3">
              <ShieldCheck className="text-lex-accent-gold" size={28} aria-hidden />
              <h1 className="font-display text-3xl font-bold">Consentimiento y privacidad</h1>
            </div>
            <p className="mt-2 text-lex-text-secondary">
              Para cumplir con el RGPD, necesitamos su consentimiento explícito antes de procesar
              sus datos y consultas jurídicas.
            </p>
            <div className="mt-8 space-y-4">
              {(
                [
                  {
                    key: 'termsOfService' as const,
                    label: 'Acepto los',
                    link: { href: '/legal/terms', text: 'Términos de Servicio' },
                    required: true,
                  },
                  {
                    key: 'privacyPolicy' as const,
                    label: 'Acepto la',
                    link: { href: '/legal/privacy', text: 'Política de Privacidad' },
                    required: true,
                  },
                  {
                    key: 'aiProcessing' as const,
                    label:
                      'Autorizo el procesamiento de mis consultas por el sistema de IA jurídica',
                    required: true,
                  },
                  {
                    key: 'analyticsCookies' as const,
                    label: 'Acepto',
                    link: { href: '/legal/cookies', text: 'cookies analíticas' },
                    suffix: ' (opcional)',
                    required: false,
                  },
                ] as const
              ).map((item) => (
                <label
                  key={item.key}
                  className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 p-4 transition-colors hover:border-white/20"
                >
                  <input
                    type="checkbox"
                    checked={consents[item.key]}
                    onChange={(e) =>
                      setConsents((prev) => ({ ...prev, [item.key]: e.target.checked }))
                    }
                    className="mt-1 h-4 w-4 rounded border-white/20 accent-lex-accent-gold"
                  />
                  <span className="text-sm">
                    {'link' in item && item.link ? (
                      <>
                        {item.label}{' '}
                        <Link href={item.link.href} className="text-lex-accent-gold hover:underline" target="_blank">
                          {item.link.text}
                        </Link>
                        {'suffix' in item ? item.suffix : ''}
                      </>
                    ) : (
                      item.label
                    )}
                    {item.required && <span className="text-lex-accent-gold"> *</span>}
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-4 text-xs text-lex-text-muted">
              Puede exportar o eliminar sus datos en cualquier momento desde Ajustes (RGPD Art.
              17 y 20).
            </p>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1"
          >
            <h1 className="font-display text-3xl font-bold">¿En qué área necesita ayuda?</h1>
            <p className="mt-2 text-lex-text-secondary">Seleccione el ámbito jurídico de su consulta.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {LEGAL_AREAS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setArea(a.id)}
                  className={cn(
                    'rounded-xl border p-4 text-left transition-all',
                    area === a.id
                      ? 'border-lex-accent-gold bg-lex-accent-gold/10'
                      : 'border-white/10 hover:border-white/20',
                  )}
                >
                  <p className="font-semibold">{a.label}</p>
                  <p className="mt-1 text-xs text-lex-text-muted">{a.agentName}</p>
                  {a.strictDisclaimer && (
                    <p className="mt-2 text-xs text-lex-risk-high">Aviso legal reforzado</p>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1"
          >
            <h1 className="font-display text-3xl font-bold">Describa su situación</h1>
            <p className="mt-2 text-lex-text-secondary">Cuanto más detalle, mejor el análisis inicial.</p>
            <div className="mt-8 space-y-4">
              <Input
                placeholder="Título del expediente (ej: Despido improcedente)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                placeholder="Describa brevemente su situación jurídica…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full rounded-xl border border-white/10 bg-lex-bg-elevated px-4 py-3 text-sm text-lex-text-primary placeholder:text-lex-text-muted focus:outline-none focus:ring-2 focus:ring-lex-accent-gold/50"
              />
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1"
          >
            <h1 className="font-display text-3xl font-bold">Documento (opcional)</h1>
            <p className="mt-2 text-lex-text-secondary">
              Puede subir un contrato, email o escrito ahora o después en el chat.
            </p>
            <div
              className="mt-8 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-lex-bg-secondary/30 px-8 py-16"
              role="region"
              aria-label="Zona de subida de documentos"
            >
              <Upload className="mb-4 text-lex-text-muted" size={40} aria-hidden />
              <p className="text-sm text-lex-text-secondary">Arrastre un archivo aquí</p>
              <p className="mt-1 text-xs text-lex-text-muted">
                PDF, DOCX, imágenes — máx. 20 MB (cifrado AES-256-GCM)
              </p>
              <Button variant="outline" className="mt-6" disabled>
                Seleccionar archivo (próximamente)
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-12 flex justify-between">
        <Button
          variant="ghost"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          <ArrowLeft size={16} aria-hidden />
          Atrás
        </Button>

        {step < steps.length - 1 ? (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={(step === 0 && !consentComplete) || (step === 1 && !area)}
          >
            Siguiente
            <ArrowRight size={16} aria-hidden />
          </Button>
        ) : (
          <Button onClick={handleFinish} disabled={!area || !title || !consentComplete || isPending}>
            {isPending ? 'Creando expediente…' : 'Iniciar consulta'}
          </Button>
        )}
      </div>
    </div>
  );
}