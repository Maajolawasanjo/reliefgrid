/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Aspekta", "sans-serif"],
        mono: ["Aspekta", "sans-serif"],
      },
      fontSize: {
        'display': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '900' }],
        'h1': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.015em', fontWeight: '800' }],
        'h2': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h3': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.005em', fontWeight: '600' }],
        'h4': ['1.25rem', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '600' }],
        'body-large': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'small': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1.5', fontWeight: '400' }],
        'label': ['0.75rem', { lineHeight: '1', letterSpacing: '0.08em', fontWeight: '600' }],
        'button-text': ['0.875rem', { lineHeight: '1', fontWeight: '600' }],
        'code-text': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
      },
      colors: {
        // Map Tailwind's default slate family directly to ReliefGrid Dark Muted Blue Green Theme
        slate: {
          50: '#F8FAFC',
          100: '#F8FAFC', // High contrast title text on dark background
          200: '#F1F5F9', // Primary headings
          300: '#CBD5E1', // Secondary headings
          400: '#94A3B8', // Grey-blue body text
          500: '#64748B', // Muted details
          600: '#475569',
          700: '#2C4559', // Border hover
          800: '#233747', // Sharp layout borders
          900: '#162531', // Card surfaces (Muted Blue Green)
          950: '#0B131A', // Main Dark Background (Very Dark Blue Green)
        },
        // Fresh Green Brand Palette from design specification
        brand: {
          50: '#F5FDF0',
          100: '#E6FCD4',
          200: '#D2FBAD',
          300: '#B9F883',
          400: '#A1F562',
          500: '#9AF376', // Fresh Green (#9AF376)
          600: '#81DC5E', // Hover state
          700: '#64C042',
          800: '#4B9B2E',
          900: '#336E1D',
          950: '#193D0B',
        },
        // Locked Official Color System
        rg: {
          text: '#94A3B8',
          technology: '#9AF376', // Fresh Green
          urgency: '#FF6B00',
          slate: '#162531',
          background: '#0B131A',
          white: '#162531',
          
          // Generated Primary Palette (Slate-Gray-Blue)
          primary: {
            50: '#f5f7f8',
            100: '#ebeff2',
            200: '#d3dee4',
            300: '#adc1cc',
            400: '#7e9db0',
            500: '#162531',
            600: '#0B131A',
            700: '#233747',
            800: '#2C4559',
            900: '#0B131A',
          },
          // Generated Secondary / Tech Palette (Fresh Green #9AF376)
          tech: {
            50: '#F5FDF0',
            100: '#E6FCD4',
            200: '#D2FBAD',
            300: '#B9F883',
            400: '#A1F562',
            500: '#9AF376',
            600: '#81DC5E',
            700: '#64C042',
            800: '#4B9B2E',
            900: '#336E1D',
          },
          // Generated Urgency Palette (#FF6B00)
          orange: {
            50: '#fff0e5',
            100: '#ffd2b3',
            200: '#ffb380',
            300: '#ff954d',
            400: '#ff761a',
            500: '#FF6B00',
            600: '#e66000',
            700: '#cc5500',
            800: '#994000',
            900: '#803500',
          },
          // Generated Slate Palette (#1C3D5A)
          navy: {
            50: '#f0f5fa',
            100: '#dbe6f0',
            200: '#b8cce0',
            300: '#8faecf',
            400: '#5f8ebd',
            500: '#1C3D5A',
            600: '#17324a',
            700: '#12273b',
            800: '#0d1c2a',
            900: '#08111a',
          },
          
          // Semantic System Status Colors
          success: {
            50: '#eefdf5',
            500: '#10B981',
            600: '#059669',
          },
          warning: {
            50: '#fffbeb',
            500: '#F59E0B',
            600: '#D97706',
          },
          danger: {
            50: '#fef2f2',
            500: '#EF4444',
            600: '#DC2626',
          },
          info: {
            50: '#eff6ff',
            500: '#3B82F6',
            600: '#2563EB',
          }
        }
      },
      spacing: {
        // 8px Spacing Grid
        'rg-1': '8px',
        'rg-2': '16px',
        'rg-3': '24px',
        'rg-4': '32px',
        'rg-5': '40px',
        'rg-6': '48px',
        'rg-8': '64px',
        'rg-12': '96px',
        'rg-16': '128px',
      },
      borderRadius: {
        'rg-sm': '4px',
        'rg-md': '8px',
        'rg-lg': '12px',
        'rg-xl': '16px',
        'rg-2xl': '24px',
        'rg-card': '12px',
        'rg-dialog': '16px',
        'rg-button': '8px',
        'rg-input': '8px',
        'rg-panel': '16px',
      },
      boxShadow: {
        'rg-sm': '0 1px 2px 0 rgba(28, 61, 90, 0.05)',
        'rg-md': '0 4px 6px -1px rgba(28, 61, 90, 0.05), 0 2px 4px -1px rgba(28, 61, 90, 0.03)',
        'rg-lg': '0 10px 15px -3px rgba(28, 61, 90, 0.08), 0 4px 6px -2px rgba(28, 61, 90, 0.04)',
        'rg-glow': '0 0 15px 0 rgba(0, 210, 255, 0.35)',
        'rg-glow-orange': '0 0 15px 0 rgba(255, 107, 0, 0.25)',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 1.5s infinite linear',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
};
