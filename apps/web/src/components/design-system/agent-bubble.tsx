'use client';

import * as Avatar from '@radix-ui/react-avatar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { LegalCitation } from './legal-citation';

interface AgentBubbleProps {
  agentName: string;
  area: string;
  content: string;
  isUser?: boolean;
  timestamp?: string;
  citations?: Array<{ norma: string; articulo: string; texto: string; url?: string }>;
  className?: string;
}

export function AgentBubble({
  agentName,
  area,
  content,
  isUser = false,
  timestamp,
  citations = [],
  className,
}: AgentBubbleProps) {
  return (
    <div
      className={cn('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row', className)}
      role="article"
      aria-label={isUser ? 'Su mensaje' : `Mensaje de ${agentName}`}
    >
      {!isUser && (
        <Avatar.Root className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-lex-accent-gold/30 bg-lex-accent-navy">
          <Avatar.Fallback className="text-xs font-semibold text-lex-accent-gold">
            {agentName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </Avatar.Fallback>
        </Avatar.Root>
      )}

      <div className={cn('max-w-[85%] space-y-1', isUser && 'items-end')}>
        {!isUser && (
          <div className="flex items-center gap-2 px-1">
            <span className="text-sm font-semibold text-lex-text-primary">{agentName}</span>
            <span className="text-xs text-lex-accent-gold">{area}</span>
          </div>
        )}

        <div
          className={cn(
            'rounded-2xl px-4 py-3 text-sm leading-relaxed',
            isUser
              ? 'rounded-tr-md bg-lex-accent-gold text-lex-bg-primary'
              : 'rounded-tl-md border border-white/[0.06] bg-lex-bg-elevated text-lex-text-primary',
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{content}</p>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none prose-headings:text-lex-text-primary prose-p:text-lex-text-secondary prose-strong:text-lex-text-primary prose-blockquote:border-lex-accent-gold/40">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
          )}
        </div>

        {!isUser && citations.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-1">
            {citations.map((c) => (
              <LegalCitation key={`${c.norma}-${c.articulo}`} {...c} />
            ))}
          </div>
        )}

        {timestamp && (
          <p className={cn('px-1 text-[10px] text-lex-text-muted', isUser && 'text-right')}>
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
}