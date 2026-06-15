'use client';

import { LayoutDashboard, ScrollText, Shield, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminGuard, AuthGuard } from '@/components/auth/auth-guard';
import { cn } from '@/lib/utils';

const adminNav = [
  { href: '/admin', icon: LayoutDashboard, label: 'Resumen' },
  { href: '/admin/users', icon: Users, label: 'Usuarios' },
  { href: '/admin/audit', icon: ScrollText, label: 'Auditoría' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AuthGuard>
      <AdminGuard>
        <div className="flex min-h-screen">
          <aside className="w-64 shrink-0 border-r border-white/[0.06] bg-lex-bg-secondary/50">
            <div className="flex h-16 items-center gap-2 border-b border-white/[0.06] px-5">
              <Shield className="text-lex-accent-gold" size={20} />
              <span className="font-display font-semibold">Admin</span>
            </div>
            <nav className="p-4" aria-label="Administración">
              <ul className="space-y-1">
                {adminNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                        pathname === item.href
                          ? 'bg-lex-accent-gold/10 text-lex-accent-gold'
                          : 'text-lex-text-secondary hover:bg-white/[0.04]',
                      )}
                    >
                      <item.icon size={18} />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="border-t border-white/[0.06] p-4">
              <Link href="/dashboard" className="text-sm text-lex-text-muted hover:text-lex-accent-gold">
                ← Volver al despacho
              </Link>
            </div>
          </aside>
          <main className="flex-1 overflow-auto p-8">{children}</main>
        </div>
      </AdminGuard>
    </AuthGuard>
  );
}