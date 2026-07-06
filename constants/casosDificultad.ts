import { Colors } from './theme';

export interface DificultadStyle {
  bg: string;
  text: string;
  border: string;
}

export const DIFICULTAD_STYLE: Record<string, DificultadStyle> = {
  Básico:     { bg: Colors.primaryLight, text: Colors.primary, border: '#BFDBFE' },
  Intermedio: { bg: '#EDE9FE',           text: '#5B21B6',      border: '#C4B5FD' },
  Avanzado:   { bg: '#E0F2FE',           text: '#0369A1',      border: '#7DD3FC' },
};