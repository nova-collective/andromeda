/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

export default {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      /**
       * Spacing tokens for consistent layout rhythm across the design system
       */
      /**
       * Spacing tokens for consistent layout rhythm across the design system
       * section: vertical spacing between major sections
       * gutter: default horizontal padding for containers/cards
       * component: internal padding standard for interactive components
       */
      spacing: {
        section: '4rem',
        gutter: '1.5rem',
        component: '0.75rem',
      },
      /**
       * Container configuration for centered content widths
       */
      container: {
        center: true,
        padding: '1rem',
        screens: {
          '2xl': '72rem',
        },
      },
      colors: {
        /** Semantic aliases mapped to CSS variables */
        surface: 'var(--bg-primary)',
        surfaceAlt: 'var(--bg-secondary)',
        textBase: 'var(--text-primary)',
        textMuted: 'var(--text-secondary)',
        border: 'var(--border-color)',
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
        accent: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        dark: {
          primary: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
          },
          secondary: {
            50: '#fdf4ff',
            100: '#fae8ff',
            200: '#f5d0fe',
            300: '#f0abfc',
            400: '#e879f9',
            500: '#d946ef',
            600: '#c026d3',
            700: '#a21caf',
            800: '#86198f',
            900: '#701a75',
          },
          accent: {
            50: '#ecfdf5',
            100: '#d1fae5',
            200: '#a7f3d0',
            300: '#6ee7b7',
            400: '#34d399',
            500: '#10b981',
            600: '#059669',
            700: '#047857',
            800: '#065f46',
            900: '#064e3b',
          }
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
      /**
       * Additional typography tuning
       */
      letterSpacing: {
        tighter: '-0.01em',
        wide: '0.04em',
        wider: '0.08em',
      },
      lineHeight: {
        tight: '1.15',
        snug: '1.25',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        pill: '9999px',
      },
      boxShadow: {
        'card': '0 0 0 1px rgba(0,0,0,.05), 0 4px 8px rgba(0,0,0,.1)',
        'card-hover': '0 0 0 1px rgba(0,0,0,.05), 0 8px 16px rgba(0,0,0,.15)',
        'dark-card': '0 0 0 1px rgba(255,255,255,.05), 0 4px 8px rgba(0,0,0,.3)',
        'dark-card-hover': '0 0 0 1px rgba(255,255,255,.08), 0 8px 16px rgba(0,0,0,.4)',
        focus: '0 0 0 2px var(--text-primary) inset',
        elevated: '0 6px 20px -2px rgba(0,0,0,0.18)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        shimmer: 'shimmer 2s linear infinite',
        pulseSoft: 'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.4' },
        },
      },
      /**
       * Timing & easing utilities for consistent micro-interactions
       */
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.4,0,0.2,1)',
        emphasized: 'cubic-bezier(.2,.8,.2,1)',
        bounceSoft: 'cubic-bezier(.34,1.56,.64,1)',
      },
      transitionDuration: {
        fast: '120ms',
        normal: '200ms',
        slow: '320ms',
      },
      /**
       * Layering helpers for consistent z-index usage
       */
      zIndex: {
        header: '50',
        overlay: '60',
        modal: '70',
        popover: '80',
      },
    },
  },
  plugins: [
    forms,
    typography,
  ],
}