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
        autumn: {
          100: '#ffc46c',
          200: '#ffb25b',
          300: '#ff9f32',
          400: '#ff956e',
          500: '#f86161',
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
