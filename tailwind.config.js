/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        imperial: {
          blue: '#1A2A44',
          gold: '#D4AF37',
          charcoal: '#333333',
          crimson: '#8B0000',
          ivory: '#F5F5F5'
        }
      },
      fontFamily: {
        'cinzel': ['Cinzel', 'serif'],
        'montserrat': ['Montserrat', 'sans-serif']
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite',
      },
      transitionTimingFunction: {
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      boxShadow: {
        'inner-lg': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.15)',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.imperial.ivory'),
            '--tw-prose-headings': theme('colors.imperial.gold'),
            '--tw-prose-links': theme('colors.imperial.gold'),
            '--tw-prose-bold': theme('colors.imperial.gold'),
            '--tw-prose-counters': theme('colors.imperial.gold'),
            '--tw-prose-bullets': theme('colors.imperial.gold'),
            '--tw-prose-quotes': theme('colors.imperial.ivory'),
            '--tw-prose-quote-borders': theme('colors.imperial.gold'),
            '--tw-prose-captions': theme('colors.imperial.ivory'),
            '--tw-prose-code': theme('colors.imperial.gold'),
            '--tw-prose-pre-code': theme('colors.imperial.ivory'),
            '--tw-prose-pre-bg': 'rgba(0, 0, 0, 0.5)',
            '--tw-prose-th-borders': theme('colors.imperial.gold'),
            '--tw-prose-td-borders': theme('colors.imperial.gold'),
          },
        },
        invert: {
          css: {
            '--tw-prose-body': theme('colors.imperial.charcoal'),
            '--tw-prose-headings': theme('colors.imperial.blue'),
            '--tw-prose-links': theme('colors.imperial.blue'),
            '--tw-prose-bold': theme('colors.imperial.blue'),
            '--tw-prose-counters': theme('colors.imperial.blue'),
            '--tw-prose-bullets': theme('colors.imperial.blue'),
            '--tw-prose-quotes': theme('colors.imperial.charcoal'),
            '--tw-prose-quote-borders': theme('colors.imperial.blue'),
            '--tw-prose-captions': theme('colors.imperial.charcoal'),
            '--tw-prose-code': theme('colors.imperial.blue'),
            '--tw-prose-pre-code': theme('colors.imperial.charcoal'),
            '--tw-prose-pre-bg': 'rgba(255, 255, 255, 0.95)',
            '--tw-prose-th-borders': theme('colors.imperial.blue'),
            '--tw-prose-td-borders': theme('colors.imperial.blue'),
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};