'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'lexai_cookie_consent_v1';

export type CookieConsentValue = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
};

export function getCookieConsent(): CookieConsentValue | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CookieConsentValue) : null;
  } catch {
    return null;
  }
}

export function setCookieConsent(value: Omit<CookieConsentValue, 'decidedAt'>) {
  const payload: CookieConsentValue = { ...value, decidedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  window.dispatchEvent(new CustomEvent('lexai:cookie-consent', { detail: payload }));
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (!getCookieConsent()) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
    return undefined;
  }, []);

  const save = (prefs: { analytics: boolean; marketing: boolean }) => {
    setCookieConsent({ necessary: true, ...prefs });
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-label="Preferencias de cookies"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.08] bg-lex-bg-elevated/95 p-6 shadow-2xl backdrop-blur-xl md:bottom-6 md:left-6 md:right-auto md:max-w-lg md:rounded-2xl md:border"
        >
          {!showPrefs ? (
            <div>
              <p className="font-display text-lg font-semibold">Respetamos su privacidad</p>
              <p className="mt-2 text-sm leading-relaxed text-lex-text-secondary">
                Usamos cookies necesarias para el funcionamiento y, con su permiso, analíticas y
                marketing. Consulte nuestra{' '}
                <Link href="/legal/cookies" className="text-lex-accent-gold hover:underline">
                  política de cookies
                </Link>
                .
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button size="sm" onClick={() => save({ analytics: true, marketing: false })}>
                  Aceptar todas
                </Button>
                <Button size="sm" variant="secondary" onClick={() => save({ analytics: false, marketing: false })}>
                  Solo necesarias
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowPrefs(true)}>
                  Configurar
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <p className="font-display font-semibold">Configurar cookies</p>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-center justify-between rounded-lg border border-white/[0.06] p-3">
                  <span>Necesarias <span className="text-lex-text-muted">(siempre activas)</span></span>
                  <span className="text-lex-accent-gold">✓</span>
                </li>
                <li className="flex items-center justify-between rounded-lg border border-white/[0.06] p-3">
                  <label htmlFor="cookie-analytics" className="cursor-pointer">Analíticas</label>
                  <input
                    id="cookie-analytics"
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="h-4 w-4 accent-lex-accent-gold"
                  />
                </li>
                <li className="flex items-center justify-between rounded-lg border border-white/[0.06] p-3">
                  <label htmlFor="cookie-marketing" className="cursor-pointer">Marketing</label>
                  <input
                    id="cookie-marketing"
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="h-4 w-4 accent-lex-accent-gold"
                  />
                </li>
              </ul>
              <Button className="mt-4 w-full" size="sm" onClick={() => save({ analytics, marketing })}>
                Guardar preferencias
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}