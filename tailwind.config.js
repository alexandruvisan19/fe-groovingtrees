/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media', // or 'class'
  theme: {
    extend: {
      maxWidth: () => ({
        '65xl': '75rem',
      }),
      flex: {
        24: '0 1 calc(25% - 1em)',
      },
      translate: () => ({
        mid: '-50%,-50%',
      }),
      colors: {
        trees1: {
          100: '#FFF3E8',
          200: '#FFF6E4',
          300: '#fefae0',
          400: '#DDDFC4',
          500: '#B8BFA7',
        },
        trees2: {
          100: '##958F6C',
          200: '##7E8052',
          300: '#606C38',
          400: '#4A5F30',
          500: '#375229',
        },
        trees3: {
          100: '#6A6C55',
          200: '#4A5136',
          300: '#283618',
          400: '#1D3015',
          500: '#142911',
        },
        trees4: {
          100: '#A9A443',
          200: '#C3A550',
          300: '#DDA15E',
          400: '#E39972',
          500: '#E99586',
        },
        trees5: {
          100: '#918418',
          200: '#A77B1E',
          300: '#BC6C25',
          400: '#C76640',
          500: '#D2675B',
        },
      },
    },
  },
  variantOrder: [
    'first',
    'last',
    'odd',
    'even',
    'visited',
    'checked',
    'empty',
    'read-only',
    'group-hover',
    'group-focus',
    'focus-within',
    'hover',
    'focus',
    'focus-visible',
    'active',
    'disabled',
  ],
  plugins: [require('@tailwindcss/typography')],
};
