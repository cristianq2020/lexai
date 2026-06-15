'use client';

import { useParams } from 'next/navigation';
import { ChatInterface } from '@/components/chat/chat-interface';
import { trpc } from '@/lib/trpc';

export default function ChatPage() {
  const params = useParams<{ caseId: string }>();
  const caseId = params.caseId;

  const { data: caseData, isLoading } = trpc.cases.getById.useQuery(
    { id: caseId },
    { enabled: !!caseId },
  );

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-lex-text-muted">
        Cargando expediente…
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="flex h-screen items-center justify-center text-lex-risk-high">
        Expediente no encontrado
      </div>
    );
  }

  return (
    <div className="h-screen">
      <ChatInterface
        caseId={caseData.id}
        caseTitle={caseData.title}
        legalArea={caseData.legalArea}
      />
    </div>
  );
}