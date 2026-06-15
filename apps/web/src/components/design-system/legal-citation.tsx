'use client';

import * as Popover from '@radix-ui/react-popover';
import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LegalCitationProps {
  norma: string;
  articulo: string;
  texto: string;
  url?: string | undefined;
  className?: string;
}

export function LegalCitation({ norma, articulo, texto, url, className }: LegalCitationProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            'inline-flex items-center gap-1 rounded-md border border-lex-accent-gold/30 bg-lex-accent-gold/10 px-2 py-0.5 text-xs font-medium text-lex-accent-gold transition-colors hover:bg-lex-accent-gold/20',
            className,
          )}
        >
          <BookOpen size={12} aria-hidden />
          {norma} art. {articulo}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="z-50 max-w-sm rounded-xl border border-white/10 bg-lex-bg-elevated p-4 shadow-xl"
          sideOffset={8}
        >
          <p className="mb-1 text-xs font-semibold text-lex-accent-gold">
            {norma} — Artículo {articulo}
          </p>
          <p className="text-sm leading-relaxed text-lex-text-secondary">{texto}</p>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs text-lex-accent-gold hover:underline"
            >
              Ver fuente oficial →
            </a>
          )}
          <Popover.Arrow className="fill-lex-bg-elevated" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}