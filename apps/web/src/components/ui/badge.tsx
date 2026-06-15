import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-white/10 bg-white/5 text-lex-text-secondary',
        gold: 'border-lex-accent-gold/30 bg-lex-accent-gold/10 text-lex-accent-gold',
        success: 'border-lex-risk-low/30 bg-lex-risk-low/10 text-lex-risk-low',
        warning: 'border-lex-risk-medium/30 bg-lex-risk-medium/10 text-lex-risk-medium',
        danger: 'border-lex-risk-high/30 bg-lex-risk-high/10 text-lex-risk-high',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };