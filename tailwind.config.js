/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Couleurs pilotées par des variables CSS => permet de changer de thème à la volée
        neon: {
          primary: 'rgb(var(--neon-primary) / <alpha-value>)',
          secondary: 'rgb(var(--neon-secondary) / <alpha-value>)',
          accent: 'rgb(var(--neon-accent) / <alpha-value>)',
        },
        surface: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          soft: 'rgb(var(--surface-soft) / <alpha-value>)',
          ring: 'rgb(var(--surface-ring) / <alpha-value>)',
        },
        ink: 'rgb(var(--ink) / <alpha-value>)',
        'ink-soft': 'rgb(var(--ink-soft) / <alpha-value>)',
      },
      boxShadow: {
        // Ombres douces et diffuses (profondeur ambiante) — plus de cerne néon.
        glow: '0 24px 60px -28px rgba(0,0,0,0.55), 0 6px 22px -14px rgb(var(--neon-primary) / 0.22)',
        'glow-soft': '0 14px 40px -22px rgba(0,0,0,0.45), 0 3px 12px -8px rgb(var(--neon-primary) / 0.14)',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        // Respiration lente et discrète (remplace le pulse néon).
        breathe: {
          '0%,100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.04)' },
        },
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        breathe: 'breathe 16s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
