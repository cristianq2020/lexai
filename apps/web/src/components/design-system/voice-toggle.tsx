'use client';

import * as Switch from '@radix-ui/react-switch';
import { Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function VoiceToggle({ enabled, onChange, disabled = false, className }: VoiceToggleProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Switch.Root
        checked={enabled}
        onCheckedChange={onChange}
        disabled={disabled}
        className={cn(
          'relative h-7 w-12 rounded-full border border-white/10 bg-lex-bg-elevated transition-colors data-[state=checked]:border-lex-accent-gold/50 data-[state=checked]:bg-lex-accent-gold/20',
          disabled && 'opacity-50',
        )}
        aria-label="Activar línea de voz"
      >
        <Switch.Thumb className="block h-5 w-5 translate-x-1 rounded-full bg-lex-text-muted transition-transform data-[state=checked]:translate-x-5 data-[state=checked]:bg-lex-accent-gold" />
      </Switch.Root>
      <div className="flex items-center gap-2 text-sm">
        {enabled ? (
          <Mic className="text-lex-accent-gold" size={18} aria-hidden />
        ) : (
          <MicOff className="text-lex-text-muted" size={18} aria-hidden />
        )}
        <span className={enabled ? 'text-lex-accent-gold' : 'text-lex-text-muted'}>
          {disabled ? 'Voz (próximamente)' : enabled ? 'Voz activa' : 'Activar voz'}
        </span>
      </div>
    </div>
  );
}