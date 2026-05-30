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
        glow: '0 0 24px -2px rgb(var(--neon-primary) / 0.55), 0 0 60px -10px rgb(var(--neon-secondary) / 0.5)',
        'glow-soft': '0 0 18px -4px rgb(var(--neon-primary) / 0.4)',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%,100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        gridmove: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '40px 40px' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.4s ease-in-out infinite',
        gridmove: 'gridmove 8s linear infinite',
      },
    },
  },
  plugins: [],
}
