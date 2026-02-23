import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(240 21% 90%)',
        input: 'hsl(240 21% 90%)',
        ring: 'hsl(242 86% 66%)',
        background: 'hsl(225 58% 97%)',
        foreground: 'hsl(224 25% 20%)',
        primary: {
          DEFAULT: 'hsl(242 75% 59%)',
          foreground: 'hsl(0 0% 100%)'
        },
        muted: {
          DEFAULT: 'hsl(220 30% 96%)',
          foreground: 'hsl(218 10% 45%)'
        },
        accent: {
          DEFAULT: 'hsl(240 80% 96%)',
          foreground: 'hsl(240 35% 30%)'
        },
        card: {
          DEFAULT: 'hsl(0 0% 100%)',
          foreground: 'hsl(224 25% 20%)'
        },
        success: 'hsl(142 71% 45%)',
        warning: 'hsl(32 95% 51%)',
        danger: 'hsl(0 84% 60%)'
      },
      borderRadius: {
        lg: '0.9rem',
        md: '0.75rem',
        sm: '0.5rem'
      },
      boxShadow: {
        card: '0 14px 32px rgba(15, 23, 42, 0.08)'
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.55' }
        },
        fadeInSoft: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        riseIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        pulseSoft: 'pulseSoft 1.2s ease-in-out infinite',
        fadeInSoft: 'fadeInSoft 260ms ease-out forwards',
        riseIn: 'riseIn 280ms ease-out forwards'
      }
    }
  },
  plugins: []
} satisfies Config;
