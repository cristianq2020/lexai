import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        lex: {
          bg: {
            primary: '#0A0A0A',
            secondary: '#111111',
            elevated: '#1A1A1A',
            glass: 'rgba(26, 26, 26, 0.72)',
          },
          text: {
            primary: '#FAFAFA',
            secondary: '#A3A3A3',
            muted: '#737373',
          },
          accent: {
            gold: '#C5A46E',
            'gold-hover': '#B8976E',
            navy: '#1A2A4A',
          },
          risk: {
            high: '#EF4444',
            medium: '#F59E0B',
            low: '#10B981',
          },
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif-legal)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;