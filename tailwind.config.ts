import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dashboard: {
          bg: '#f3f6fb',
          card: '#ffffff',
          ink: '#1f2937',
          accent: '#0f766e',
          muted: '#64748b',
          danger: '#b91c1c',
          dangerSoft: '#fee2e2',
        },
      },
      fontFamily: {
        sans: ['"Source Sans 3"', '"Segoe UI"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 8px 24px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
} satisfies Config;
