/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

import {
  colors,
  container,
  spacing,
  fontFamily,
  letterSpacing,
  lineHeight,
  borderRadius,
  boxShadow,
  animation,
  keyframes,
  transitionTimingFunction,
  transitionDuration,
  zIndex,
} from './src/app/components/tokens';

export default {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      spacing,
      container,
      colors,
      fontFamily,
      letterSpacing,
      lineHeight,
      borderRadius,
      boxShadow,
      animation,
      keyframes,
      transitionTimingFunction,
      transitionDuration,
      zIndex,
    },
  },
  plugins: [
    forms,
    typography,
  ],
}