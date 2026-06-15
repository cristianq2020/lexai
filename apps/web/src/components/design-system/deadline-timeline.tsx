'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RiskSemaphore } from './risk-semaphore';

export interface DeadlineItem {
  id: string;
  title: string;
  dueDate: Date | string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: string;
}

const urgencyToSemaphore = {
  LOW: 'verde' as const,
  MEDIUM: 'amarillo' as const,
  HIGH: 'amarillo' as const,
  CRITICAL: 'rojo' as const,
};

interface DeadlineTimelineProps {
  deadlines: DeadlineItem[];
  className?: string;
}

export function DeadlineTimeline({ deadlines, className }: DeadlineTimelineProps) {
  if (deadlines.length === 0) {
    return (
      <p className="text-sm text-lex-text-muted">No hay plazos próximos registrados.</p>
    );
  }

  return (
    <div className={cn('space-y-3', className)} role="list" aria-label="Próximos plazos">
      {deadlines.map((deadline, i) => {
        const date = new Date(deadline.dueDate);
        const formatted = date.toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });

        return (
          <motion.div
            key={deadline.id}
            role="listitem"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-lex-bg-secondary/50 p-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-lex-accent-navy/50">
              <Calendar className="text-lex-accent-gold" size={18} aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-lex-text-primary">{deadline.title}</p>
              <p className="flex items-center gap-1 text-xs text-lex-text-muted">
                <Clock size={12} aria-hidden />
                {formatted}
              </p>
            </div>
            <RiskSemaphore
              semaphore={urgencyToSemaphore[deadline.urgency]}
              size="sm"
              showLabel={false}
            />
          </motion.div>
        );
      })}
    </div>
  );
}