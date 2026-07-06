import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '../Appheader';
import { AppLogo } from '../branding/AppLogo';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../constants/theme';
import { useAlertasClinicasCenter } from '../../context/AlertasClinicasContext';
import { getBottomViewportInset } from '../../utils/layout';

type AppRoute = Href;

interface Opcion {
  icono: keyof typeof Ionicons.glyphMap;
  titulo: string;
  descripcion: string;
  ruta: AppRoute;
  iconBg: string;
  iconColor: string;
  badgeCount?: number;
}

export default function GuiasScreen() {
  const router = useRouter();
  const { unreadCount } = useAlertasClinicasCenter();
  const insets = useSafeAreaInsets();
  const bottomInset = getBottomViewportInset(insets.bottom);

  // Opción destacada (ancho completo) + cuadrícula con el resto.
  const destacada: Opcion = {
    icono: 'notifications-outline',
    titulo: 'Alertas Clínicas',
    descripcion: 'Resultados simulados, recomendaciones automáticas y casos pendientes por resolver.',
    ruta: '/alertas' as Href,
    iconBg: Colors.primary,
    iconColor: Colors.white,
    badgeCount: unreadCount,
  };

  const opciones: Opcion[] = [
    {
      icono: 'chatbubbles-outline',
      titulo: 'Asistente Clínico',
      descripcion: 'Consulta guías y algoritmos en conversación.',
      ruta: '/asistente' as Href,
      iconBg: Colors.primaryLight,
      iconColor: Colors.primary,
    },
    {
      icono: 'search-outline',
      titulo: 'Búsqueda inteligente',
      descripcion: 'Halla hallazgos clínicos y recomendaciones.',
      ruta: '/(tabs)',
      iconBg: Colors.accentLight,
      iconColor: Colors.accentDark,
    },
    {
      icono: 'pulse-outline',
      titulo: 'Algoritmos Clínicos',
      descripcion: 'Explora y ejecútalos paso a paso.',
      ruta: '/algoritmos' as Href,
      iconBg: Colors.primaryLight,
      iconColor: Colors.primary,
    },
    {
      icono: 'flask-outline',
      titulo: 'Casos Clínicos',
      descripcion: 'Practica con casos reales.',
      ruta: '/casos',
      iconBg: Colors.accentLight,
      iconColor: Colors.accentDark,
    },
  ];

  return (
    <View style={styles.container}>
      <AppHeader titulo="Guías Clínicas" icono="library-outline" />

      <ScrollView
        style={styles.content}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: bottomInset }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero protagonista (esmeralda) */}
        <View style={styles.hero}>
          <View pointerEvents="none" style={styles.heroDecor} />
          <View style={styles.heroTopRow}>
            <View style={styles.heroTextBlock}>
              <Text style={styles.heroEyebrow}>Entorno clínico</Text>
              <Text style={styles.heroTitle}>¿Qué deseas hacer hoy?</Text>
              <Text style={styles.heroDescription}>
                Consulta guías, ejecuta algoritmos y refuerza tus decisiones clínicas.
              </Text>
            </View>
            <View style={styles.heroLogoWrap}>
              <AppLogo variant="symbol" width={44} height={34} />
            </View>
          </View>
        </View>

        {/* Tarjeta destacada */}
        <TouchableOpacity
          style={styles.featured}
          onPress={() => router.push(destacada.ruta)}
          activeOpacity={0.85}
        >
          <View style={[styles.featuredIcon, { backgroundColor: destacada.iconBg }]}>
            <Ionicons name={destacada.icono} size={26} color={destacada.iconColor} />
          </View>
          <View style={styles.featuredTexts}>
            <View style={styles.featuredTitleRow}>
              <Text style={styles.featuredTitulo}>{destacada.titulo}</Text>
              {!!destacada.badgeCount && (
                <View style={styles.badgeCount}>
                  <Text style={styles.badgeCountText}>{destacada.badgeCount}</Text>
                </View>
              )}
            </View>
            <Text style={styles.featuredDesc} numberOfLines={2}>
              {destacada.descripcion}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
        </TouchableOpacity>

        {/* Cuadrícula de opciones */}
        <View style={styles.grid}>
          {opciones.map((op) => (
            <TouchableOpacity
              key={String(op.ruta)}
              style={styles.tile}
              onPress={() => router.push(op.ruta)}
              activeOpacity={0.85}
            >
              <View style={[styles.tileIcon, { backgroundColor: op.iconBg }]}>
                <Ionicons name={op.icono} size={24} color={op.iconColor} />
              </View>
              <Text style={styles.tileTitulo} numberOfLines={2}>
                {op.titulo}
              </Text>
              <Text style={styles.tileDesc} numberOfLines={2}>
                {op.descripcion}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={18} color={Colors.primary} />
          <Text style={styles.infoTexto}>
            Sistema basado en guías clínicas y algoritmos de apoyo a la decisión.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1 },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    gap: Spacing.lg,
  },

  // Hero
  hero: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.rounded,
    padding: Spacing.xl,
    overflow: 'hidden',
    ...Shadows.medium,
  },
  heroDecor: {
    position: 'absolute',
    top: -50,
    right: -30,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: Colors.primaryDark,
    opacity: 0.5,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  heroTextBlock: { flex: 1, gap: 6 },
  heroLogoWrap: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEyebrow: {
    ...Typography.bodySmall,
    color: Colors.accentLight,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '700',
  },
  heroTitle: {
    ...Typography.h4,
    color: Colors.white,
  },
  heroDescription: {
    ...Typography.bodySmall,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 20,
  },

  // Tarjeta destacada
  featured: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.large,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    ...Shadows.medium,
  },
  featuredIcon: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.rounded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredTexts: { flex: 1, gap: 4 },
  featuredTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  featuredTitulo: { fontSize: 16, fontWeight: '700', color: Colors.dark },
  featuredDesc: { ...Typography.bodySmall, color: Colors.gray, lineHeight: 18 },

  // Cuadrícula
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: Spacing.lg,
  },
  tile: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.large,
    padding: Spacing.lg,
    gap: Spacing.sm,
    ...Shadows.small,
  },
  tileIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  tileTitulo: { fontSize: 14, fontWeight: '700', color: Colors.dark, lineHeight: 18 },
  tileDesc: { ...Typography.caption, color: Colors.gray, lineHeight: 16 },

  badgeCount: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.accentDark,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xs,
  },
  badgeCountText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '700',
  },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
  },
  infoTexto: {
    flex: 1,
    ...Typography.bodySmall,
    color: Colors.primaryDark,
    lineHeight: 18,
  },
});
