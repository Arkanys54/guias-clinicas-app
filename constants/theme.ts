/**
 * Sistema de temas y constantes visuales para la app
 * Ubicación: constants/theme.ts
 */

export const Colors = {
  // Paleta: Esmeralda + grafito
  primary: '#059669',
  primaryDark: '#065F46',
  primaryLight: '#D9F2E7',
  accent: '#F59E0B',
  accentDark: '#D97706',
  accentLight: '#FEF3E2',

  // Colores secundarios
  success: '#16A34A',
  warning: '#D97706',
  danger: '#DC2626',
  info: '#0EA5E9',

  // Escala de grises (grafito)
  white: '#FFFFFF',
  light: '#F1F6F3',
  lightGray: '#E3ECE7',
  gray: '#8C9A94',
  darkGray: '#556169',
  dark: '#1F2A37',
  black: '#0F1720',

  // Fondos
  background: '#F4FAF7',
  surface: '#FFFFFF',
  surfaceLight: '#EDF6F1',

  // Estados
  border: '#DBE7E1',
  disabled: '#C7D3CD',

  // Especiales
  hallazgoAccent: '#059669',
  relevanciaGreen: '#16A34A',
  relevanciaYellow: '#F59E0B',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  small: 8,
  medium: 12,
  large: 18,
  rounded: 26,
};

export const Typography = {
  // Heading
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  
  // Body
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  bodyXSmall: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  
  // Labels
  label: {
    fontSize: 13,
    fontWeight: '600' as const,
    lineHeight: 18,
  },
  labelSmall: {
    fontSize: 11,
    fontWeight: '600' as const,
    lineHeight: 16,
  },
  
  // Caption
  caption: {
    fontSize: 11,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
};

export const Animations = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
};
