import { Platform } from 'react-native';

const ANDROID_NAVIGATION_BAR_FALLBACK = 48;

export function getBottomViewportInset(bottomInset: number) {
  if (Platform.OS !== 'android') {
    return bottomInset;
  }

  // Usa el inset real de la barra de navegación. En navegación por gestos
  // suele ser menor a 48px; forzar 48 dejaba una franja blanca de más
  // justo encima de la barra. El fallback solo aplica si el inset llega
  // en 0 (no resuelto), para no meter el contenido debajo de la barra.
  return bottomInset > 0 ? bottomInset : ANDROID_NAVIGATION_BAR_FALLBACK;
}
