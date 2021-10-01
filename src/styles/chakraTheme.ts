import { extendTheme } from '@chakra-ui/react';

const colors = {
  // Use 500 for light, 700 for regular, 900 for dark
  'cottage-green': {
    50: '#A4CEBA',
    100: '#92C4AC',
    200: '#6DB090',
    300: '#509574',
    400: '#3D7158',
    500: '#235C48',
    600: '#294C3B',
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
  'cottage-green-50': {
    500: '#D2E3D5',
    600: '#daefe6',
    700: '#d8e0d8',
  },
  'cottage-light-green': {
    500: '#E3EDE9',
    600: '#daefe6',
    700: '#d8e0d8',
  },
  'cottage-orange': {
    500: '#F68B48',
    600: '#ef7a31',
    700: '#e6732b',
  }
};

const fonts = {
  fonts: {
    heading: 'Inter',
    body: 'Inter',
  },
};

const overrides = {
  colors,
  fonts,
};

export default extendTheme(overrides);
