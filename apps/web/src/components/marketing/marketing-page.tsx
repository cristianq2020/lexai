import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';

interface MarketingPageProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function MarketingPage({ title, subtitle, children }: MarketingPageProps) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <header className="mb-16 text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-lex-text-secondary">{subtitle}</p>
          </header>
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}