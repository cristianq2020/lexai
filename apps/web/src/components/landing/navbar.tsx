'use client';

import { ChevronDown, Menu, Scale, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const productLinks = [
  { href: '/producto', label: 'Producto' },
  { href: '/#areas', label: 'Áreas jurídicas' },
  { href: '/#demo', label: 'Demo 60s' },
  { href: '/seguridad', label: 'Seguridad' },
];

const companyLinks = [
  { href: '/empresa', label: 'Sobre nosotros' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/#faq', label: 'FAQ' },
];

const legalLinks = [
  { href: '/legal/terms', label: 'Términos' },
  { href: '/legal/privacy', label: 'Privacidad' },
  { href: '/legal/cookies', label: 'Cookies' },
  { href: '/legal/aviso-legal', label: 'Aviso legal' },
];

function NavDropdown({
  label,
  links,
}: {
  label: string;
  links: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="flex items-center gap-1 text-sm text-lex-text-secondary transition-colors hover:text-lex-text-primary"
        aria-expanded={open}
      >
        {label}
        <ChevronDown size={14} className={cn('transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 min-w-[200px] rounded-xl border border-white/[0.08] bg-lex-bg-elevated py-2 shadow-xl">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-2 text-sm text-lex-text-secondary hover:bg-white/[0.04] hover:text-lex-text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-lex-bg-primary/85 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6" aria-label="Principal">
        <Link href="/" className="flex items-center gap-2">
          <Scale className="text-lex-accent-gold" size={22} aria-hidden />
          <span className="font-display text-lg font-semibold">LexAI</span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          <NavDropdown label="Producto" links={productLinks} />
          <Link href="/#pricing" className="text-sm text-lex-text-secondary hover:text-lex-text-primary">
            Precios
          </Link>
          <NavDropdown label="Empresa" links={companyLinks} />
          <NavDropdown label="Legal" links={legalLinks} />
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Iniciar sesión</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/login">Empezar gratis</Link>
          </Button>
        </div>

        <button
          type="button"
          className="lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-white/[0.06] bg-lex-bg-elevated px-6 py-4 lg:hidden">
          <div className="space-y-4">
            {[...productLinks, { href: '/#pricing', label: 'Precios' }, ...companyLinks, ...legalLinks].map(
              (link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-lex-text-secondary"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ),
            )}
            <Button asChild className="w-full">
              <Link href="/login">Empezar gratis</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}