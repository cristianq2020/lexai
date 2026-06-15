'use client';

import {
  FileText,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Plus,
  Scale,
  Settings,
  Shield,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { clearAuthToken } from '@/lib/auth-storage';
import { cn } from '@/lib/utils';
import { trpc } from '@/lib/trpc';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/documents', icon: FileText, label: 'Documentos' },
  { href: '/dashboard/escritos', icon: FolderOpen, label: 'Escritos' },
  { href: '/dashboard/settings', icon: Settings, label: 'Ajustes' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user } = trpc.auth.me.useQuery();
  const { data: casesData } = trpc.cases.list.useQuery({ limit: 20 });

  const handleLogout = () => {
    clearAuthToken();
    router.push('/login');
  };

  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col border-r border-white/[0.06] bg-lex-bg-secondary/50">
      <div className="flex h-16 items-center gap-2 border-b border-white/[0.06] px-5">
        <Scale className="text-lex-accent-gold" size={22} aria-hidden />
        <span className="font-display font-semibold">LexAI</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <Button asChild variant="outline" size="sm" className="mb-6 w-full">
          <Link href="/onboarding">
            <Plus size={16} aria-hidden />
            Nuevo expediente
          </Link>
        </Button>

        <p className="mb-3 px-2 text-xs font-medium uppercase tracking-wider text-lex-text-muted">
          Expedientes
        </p>
        <nav aria-label="Expedientes">
          <ul className="space-y-1">
            {casesData?.cases.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/dashboard/chat/${c.id}`}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors',
                    pathname.includes(c.id)
                      ? 'bg-lex-accent-gold/10 text-lex-accent-gold'
                      : 'text-lex-text-secondary hover:bg-white/5 hover:text-lex-text-primary',
                  )}
                >
                  <MessageSquare size={16} aria-hidden />
                  <span className="truncate flex-1">{c.title}</span>
                  <Badge variant="default" className="text-[10px]">
                    {c.legalArea.slice(0, 3)}
                  </Badge>
                </Link>
              </li>
            ))}
            {casesData?.cases.length === 0 && (
              <li className="px-3 py-4 text-xs text-lex-text-muted">
                Sin expedientes. Cree uno nuevo.
              </li>
            )}
          </ul>
        </nav>

        <div className="mt-8 border-t border-white/[0.06] pt-4">
          {user?.role === 'ADMIN' && (
            <Link
              href="/admin"
              className={cn(
                'mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                pathname.startsWith('/admin')
                  ? 'bg-lex-accent-gold/10 text-lex-accent-gold'
                  : 'text-lex-text-secondary hover:text-lex-accent-gold',
              )}
            >
              <Shield size={16} aria-hidden />
              Administración
            </Link>
          )}
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                pathname === item.href
                  ? 'text-lex-accent-gold'
                  : 'text-lex-text-secondary hover:text-lex-text-primary',
              )}
            >
              <item.icon size={16} aria-hidden />
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-white/[0.06] p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-lex-text-muted hover:text-lex-risk-high"
        >
          <LogOut size={16} aria-hidden />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}