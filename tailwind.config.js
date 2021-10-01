const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  important: true,
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        // Use 300 for light, 500 for regular, 700 for dark
        'cottage-green': {
          50: '#A4CEBA',
          100: '#92C4AC',
          200: '#6DB090',
          300: '#509574',
          400: '#3D7158',
          500: '#294C3B',
          600: '#234133',
          700: '#1D362A',
          800: '#172C22',
          900: '#122119',
        },
        'cottage-blue': {
          50: '#C2C7FB',
          100: '#B5BCFA',
          200: '#9DA6F8',
          300: '#8490F6',
          400: '#6C7AF5',
          500: '#5363F3',
          600: '#283CF0',
          700: '#0F23DA',
          800: '#0C1CAE',
          900: '#091583',
        },
        'off-white': {
          DEFAULT: '#F8F7F7',
        },
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      h: {
        9: '2.25rem'
      },
    },
    backgroundColor: theme => ({
      ...theme('colors'),
      'navItemHover': '#E3EDE9',
      'navItemActive': '#E3EDE9',
      'lightGrey': '#E6E8E5',
      'softGreen': '#E3EDE9',
      'softGreen-100': '#D3DEDA',
      'softGreen-20': '#d3deda20',
      'softGreen-200': '#D2E3D5',
      'lightGreen': '#235C48',
      'lightGreen-100': '#205241',
      'lightGreen-200': '#e3ede94d',
      'grey': '#939C9C',
      'mediumGreen':'#294C3B',
      'softWarn': '#EB6237',
      'lightGrey-100': '#f7f7f7'
    }),
    borderColor: theme => ({
      ...theme('colors'),
      'lightGreen': '#E9EFED',
      'lightGrey': '#E6E8E5',
      'lightGreen-100': '#D2E3D5',
      'mediumGreen':'#294C3B'
    }),
    textColor: theme => ({
      ...theme('colors'),   
      'lightGreen': '#E3EDE9',
      'lightGreen-100': '#235C48',
      'lightGreen-200': '#4EA241',
      'darkGray': '#525D5F',
      'grey': '#939C9C',
      'darkGreen': '#102D29',
      'darkGreen-100': '#9cbbaf',
      'error': '#EB6237',
      'mediumGreen':'#294C3B'
    }),
  },
  variants: {
    extend: {},
  },
  plugins: [require(`@tailwindcss/forms`)],
};