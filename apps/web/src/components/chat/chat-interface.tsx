'use client';

import { getLegalAreaById, type LegalAreaId } from '@lexai/shared';
import { Paperclip, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { AgentBubble } from '@/components/design-system/agent-bubble';
import { ReasoningIndicator } from '@/components/design-system/reasoning-indicator';
import { VoiceToggle } from '@/components/design-system/voice-toggle';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';

const AREA_MAP: Record<string, LegalAreaId> = {
  LABORAL: 'laboral', CIVIL: 'civil', PENAL: 'penal', FAMILIA: 'familia',
  FISCAL: 'fiscal', TRAFICO: 'trafico', CONSUMIDOR: 'consumidor',
  MERCANTIL: 'mercantil', EXTRANJERIA: 'extranjeria',
};

interface ChatInterfaceProps {
  caseId: string;
  caseTitle: string;
  legalArea: string;
}

export function ChatInterface({ caseId, caseTitle, legalArea }: ChatInterfaceProps) {
  const [message, setMessage] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [consultationId, setConsultationId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const areaId = AREA_MAP[legalArea] ?? 'civil';
  const area = getLegalAreaById(areaId);

  const createConsultation = trpc.consultations.create.useMutation({
    onSuccess: (data) => setConsultationId(data.id),
  });

  const { data: messagesData, refetch: refetchMessages } = trpc.consultations.listMessages.useQuery(
    { consultationId: consultationId ?? '' },
    { enabled: !!consultationId },
  );

  const sendMessage = trpc.consultations.sendMessage.useMutation({
    onSuccess: () => {
      setMessage('');
      void refetchMessages();
    },
  });

  const initRef = useRef(false);
  const mutateRef = useRef(createConsultation.mutate);
  mutateRef.current = createConsultation.mutate;

  useEffect(() => {
    if (!initRef.current) {
      initRef.current = true;
      mutateRef.current({ caseId, topic: caseTitle });
    }
  }, [caseId, caseTitle]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesData?.messages, sendMessage.isPending]);

  const handleSend = () => {
    if (!message.trim() || !consultationId) return;
    sendMessage.mutate({ consultationId, content: message.trim() });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
        <div>
          <h1 className="font-display text-lg font-semibold">{caseTitle}</h1>
          <p className="text-sm text-lex-accent-gold">
            {area?.agentName} · {area?.label}
          </p>
        </div>
        <VoiceToggle enabled={voiceEnabled} onChange={setVoiceEnabled} disabled />
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col">
          <div className="flex-1 space-y-6 overflow-y-auto p-6">
            {messagesData?.messages.map((msg) => {
              const meta = msg.metadata as {
                agentName?: string;
                areaId?: string;
                legalResponse?: { legislacionCitada?: Array<{ norma: string; articulo: string; texto: string; url?: string }> };
              } | null;

              const isUser = msg.role === 'USER';
              const citations = meta?.legalResponse?.legislacionCitada ?? [];

              return (
                <AgentBubble
                  key={msg.id}
                  agentName={meta?.agentName ?? area?.agentName ?? 'Agente LexAI'}
                  area={area?.label ?? legalArea}
                  content={msg.content}
                  isUser={isUser}
                  timestamp={new Date(msg.createdAt).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  citations={isUser ? [] : citations}
                />
              );
            })}
            {sendMessage.isPending && <ReasoningIndicator />}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-white/[0.06] p-4">
            <div
              className="mb-3 flex items-center justify-center rounded-xl border border-dashed border-white/10 py-6 text-xs text-lex-text-muted"
              role="region"
              aria-label="Subida de documentos"
            >
              <Paperclip size={14} className="mr-2" aria-hidden />
              Arrastre documentos aquí (próximamente)
            </div>
            <div className="flex gap-3">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escriba su consulta jurídica…"
                rows={2}
                className="flex-1 resize-none rounded-xl border border-white/10 bg-lex-bg-elevated px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-lex-accent-gold/50"
                aria-label="Mensaje"
              />
              <Button
                onClick={handleSend}
                disabled={!message.trim() || sendMessage.isPending || !consultationId}
                size="icon"
                className="h-auto shrink-0"
                aria-label="Enviar mensaje"
              >
                <Send size={18} aria-hidden />
              </Button>
            </div>
          </div>
        </div>

        <aside className="hidden w-80 shrink-0 border-l border-white/[0.06] bg-lex-bg-secondary/30 p-6 lg:block">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-lex-text-muted">
            Expediente
          </h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-lex-text-muted">Área</dt>
              <dd className="font-medium">{area?.label}</dd>
            </div>
            <div>
              <dt className="text-lex-text-muted">Especialista</dt>
              <dd className="font-medium">{area?.agentName}</dd>
            </div>
            <div>
              <dt className="text-lex-text-muted">Legislación</dt>
              <dd className="text-lex-text-secondary">
                {area?.legislation.join(' · ')}
              </dd>
            </div>
          </dl>
          <p className="mt-8 text-[10px] leading-relaxed text-lex-text-muted">
            {area?.strictDisclaimer
              ? '⚠️ Área con disclaimer reforzado. Esta información no sustituye asesoramiento profesional vinculante.'
              : 'Información jurídica general. Consulte un abogado para decisiones críticas.'}
          </p>
        </aside>
      </div>
    </div>
  );
}