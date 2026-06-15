'use client';

import { motion } from 'framer-motion';

export function ReasoningIndicator() {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-lex-bg-elevated px-4 py-3"
      role="status"
      aria-live="polite"
      aria-label="El agente está razonando"
    >
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-lex-accent-gold"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
      <span className="text-sm text-lex-text-secondary">
        El agente está analizando su consulta…
      </span>
    </div>
  );
}