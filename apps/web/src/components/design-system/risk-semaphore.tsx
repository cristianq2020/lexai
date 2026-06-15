import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type Semaphore = 'rojo' | 'amarillo' | 'verde' | 'RED' | 'YELLOW' | 'GREEN';

const config = {
  rojo: { icon: XCircle, color: 'text-lex-risk-high', bg: 'bg-lex-risk-high/15', label: 'Alto' },
  RED: { icon: XCircle, color: 'text-lex-risk-high', bg: 'bg-lex-risk-high/15', label: 'Alto' },
  amarillo: { icon: AlertTriangle, color: 'text-lex-risk-medium', bg: 'bg-lex-risk-medium/15', label: 'Medio' },
  YELLOW: { icon: AlertTriangle, color: 'text-lex-risk-medium', bg: 'bg-lex-risk-medium/15', label: 'Medio' },
  verde: { icon: CheckCircle2, color: 'text-lex-risk-low', bg: 'bg-lex-risk-low/15', label: 'Bajo' },
  GREEN: { icon: CheckCircle2, color: 'text-lex-risk-low', bg: 'bg-lex-risk-low/15', label: 'Bajo' },
} as const;

interface RiskSemaphoreProps {
  semaphore: Semaphore;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function RiskSemaphore({
  semaphore,
  score,
  size = 'md',
  showLabel = true,
  className,
}: RiskSemaphoreProps) {
  const cfg = config[semaphore];
  const Icon = cfg.icon;
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 28 : 20;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1.5',
        cfg.bg,
        className,
      )}
      role="status"
      aria-label={`Riesgo ${cfg.label}${score !== undefined ? `: ${score}/10` : ''}`}
    >
      <Icon className={cn(cfg.color)} size={iconSize} aria-hidden />
      {showLabel && (
        <span className={cn('text-sm font-medium', cfg.color)}>
          {cfg.label}
          {score !== undefined ? ` · ${score}/10` : ''}
        </span>
      )}
    </div>
  );
}