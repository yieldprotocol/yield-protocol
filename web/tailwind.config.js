module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    minHeight: {
      display: '50rem',
    },
    fontFamily: {
      sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
    },
    extend: {
      colors: {
        darkPurple: '#14043a',
        primary: '#5641ff',
        secondary: '#A3FFE3',
        offwhite: '#FAFAFA',
        yellow: 'F7D958',
      },
    },
  },
  variants: {},
  plugins: [],
}
