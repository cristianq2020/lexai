import Link from 'next/link';
import { Scale } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] px-6 py-16">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <Scale className="text-lex-accent-gold" size={24} aria-hidden />
            <span className="font-display text-xl font-semibold">LexAI</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-lex-text-secondary">
            Despacho digital de inteligencia artificial jurídica. Democratizando el acceso a
            asesoramiento legal de calidad en España y Latinoamérica.
          </p>
          <p className="mt-4 text-xs text-lex-text-muted">
            LexAI no sustituye el consejo de un abogado colegiado.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold">Producto</h4>
          <ul className="space-y-2 text-sm text-lex-text-secondary">
            <li><Link href="/producto" className="hover:text-lex-text-primary">Funcionalidades</Link></li>
            <li><Link href="/#areas" className="hover:text-lex-text-primary">Áreas jurídicas</Link></li>
            <li><Link href="/#demo" className="hover:text-lex-text-primary">Demo 60s</Link></li>
            <li><Link href="/#pricing" className="hover:text-lex-text-primary">Precios</Link></li>
            <li><Link href="/seguridad" className="hover:text-lex-text-primary">Seguridad</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold">Empresa</h4>
          <ul className="space-y-2 text-sm text-lex-text-secondary">
            <li><Link href="/empresa" className="hover:text-lex-text-primary">Sobre nosotros</Link></li>
            <li><Link href="/contacto" className="hover:text-lex-text-primary">Contacto</Link></li>
            <li><Link href="/#faq" className="hover:text-lex-text-primary">FAQ</Link></li>
            <li><Link href="/login" className="hover:text-lex-text-primary">Acceder</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold">Legal</h4>
          <ul className="space-y-2 text-sm text-lex-text-secondary">
            <li><Link href="/legal/terms" className="hover:text-lex-text-primary">Términos</Link></li>
            <li><Link href="/legal/privacy" className="hover:text-lex-text-primary">Privacidad (RGPD)</Link></li>
            <li><Link href="/legal/cookies" className="hover:text-lex-text-primary">Cookies</Link></li>
            <li><Link href="/legal/aviso-legal" className="hover:text-lex-text-primary">Aviso legal</Link></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 text-xs text-lex-text-muted md:flex-row">
        <p>© {new Date().getFullYear()} LexAI Technologies S.L. Todos los derechos reservados.</p>
        <p>Conforme RGPD · LSSI-CE · Datos alojados en UE</p>
      </div>
    </footer>
  );
}