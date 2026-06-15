import Link from 'next/link';
import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';

interface Section {
  id: string;
  title: string;
  content: string;
}

interface LegalDocumentProps {
  title: string;
  description: string;
  version: string;
  effectiveDate: string;
  sections: Section[];
}

function renderContent(text: string) {
  return text.split('\n\n').map((paragraph, i) => (
    <p key={i} className="mb-4 leading-relaxed text-lex-text-secondary">
      {paragraph.split('**').map((part, j) =>
        j % 2 === 1 ? (
          <strong key={j} className="font-semibold text-lex-text-primary">
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </p>
  ));
}

export function LegalDocument({
  title,
  description,
  version,
  effectiveDate,
  sections,
}: LegalDocumentProps) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen px-6 py-16">
        <article className="mx-auto max-w-3xl">
          <header className="mb-12 border-b border-white/[0.06] pb-10">
            <p className="text-sm text-lex-accent-gold">Documentación legal</p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">{title}</h1>
            <p className="mt-4 text-lg text-lex-text-secondary">{description}</p>
            <p className="mt-6 text-sm text-lex-text-muted">
              Versión {version} · Vigente desde {effectiveDate}
            </p>
          </header>

          <nav className="mb-12 rounded-xl border border-white/[0.06] bg-lex-bg-secondary/40 p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-lex-text-muted">
              Índice
            </h2>
            <ol className="space-y-2 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-lex-accent-gold hover:underline">
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {sections.map((section) => (
            <section key={section.id} id={section.id} className="mb-12 scroll-mt-24">
              <h2 className="mb-4 font-display text-2xl font-semibold">{section.title}</h2>
              {renderContent(section.content)}
            </section>
          ))}

          <footer className="mt-16 rounded-xl border border-white/[0.06] bg-lex-bg-elevated/50 p-6 text-sm text-lex-text-secondary">
            <p>
              ¿Dudas? Contacte con{' '}
              <Link href="/contacto" className="text-lex-accent-gold hover:underline">
                soporte
              </Link>{' '}
              o el DPO en{' '}
              <a href="mailto:dpo@lexai.es" className="text-lex-accent-gold hover:underline">
                dpo@lexai.es
              </a>
            </p>
          </footer>
        </article>
      </main>
      <Footer />
    </>
  );
}