import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '../components/Appheader';
import { obtenerCategorias } from '../services/api';
import { CategoriaDto } from '../services/api.types';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../constants/theme';
import { getBottomViewportInset } from '../utils/layout';

// Acentos por categoría — en armonía con la paleta esmeralda + ámbar
const ACCENT_COLORS = [
  { color: Colors.primary, bg: Colors.primaryLight },   // Esmeralda
  { color: Colors.accentDark, bg: Colors.accentLight }, // Ámbar
  { color: '#0F766E', bg: '#E3F3EF' },                  // Teal
  { color: '#4D7C0F', bg: '#EFF6E1' },                  // Verde oliva
  { color: Colors.primaryDark, bg: '#DCEFE7' },         // Esmeralda oscuro
  { color: '#B45309', bg: '#FBEBD6' },                  // Ámbar oscuro
];

export default function CasosScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomInset = getBottomViewportInset(insets.bottom);

  const [categorias, setCategorias] = useState<CategoriaDto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    setCargando(true);
    setError(null);
    const res = await obtenerCategorias();
    if (res.success && res.data) {
      setCategorias(res.data.filter((c) => c.activa && c.totalCasos > 0));
    } else {
      setError(res.error ?? 'Error al cargar categorías.');
    }
    setCargando(false);
  };

  const irALista = (cat: CategoriaDto) => {
    router.push({
      pathname: '/casos-lista',
      params: { categoriaId: String(cat.id), categoriaNombre: cat.nombre },
    });
  };

  return (
    <View style={styles.container}>
      <AppHeader
        titulo="Casos Clínicos"
        icono="flask-outline"
        accionIzquierda={{ icono: 'arrow-back', onPress: () => router.back() }}
        mostrarPerfil={false}
      />

      {cargando ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Cargando categorías…</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Ionicons name="cloud-offline-outline" size={52} color={Colors.gray} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={cargar}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={categorias}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={[styles.lista, { paddingBottom: bottomInset }]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.hero}>
              <View pointerEvents="none" style={styles.heroDecor} />
              <View style={styles.heroTextBlock}>
                <Text style={styles.heroEyebrow}>Entrenamiento clínico</Text>
                <Text style={styles.heroTitle}>¿Qué área deseas practicar?</Text>
                <Text style={styles.heroSub}>
                  {categorias.length}{' '}
                  {categorias.length === 1 ? 'categoría disponible' : 'categorías disponibles'}
                </Text>
              </View>
              <View style={styles.heroIconWrap}>
                <Ionicons name="flask-outline" size={26} color={Colors.white} />
              </View>
            </View>
          }
          renderItem={({ item, index }) => {
            const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];
            return (
              <TouchableOpacity
                style={styles.catCard}
                onPress={() => irALista(item)}
                activeOpacity={0.82}
              >
                <View style={[styles.catIconWrap, { backgroundColor: accent.bg }]}>
                  <Text style={styles.catEmoji}>{item.icono ?? '🔬'}</Text>
                </View>

                <View style={styles.catTexts}>
                  <Text style={[styles.catNombre, { color: accent.color }]}>{item.nombre}</Text>
                  {item.descripcion ? (
                    <Text style={styles.catDesc} numberOfLines={2}>
                      {item.descripcion}
                    </Text>
                  ) : null}
                  <View style={styles.catMeta}>
                    <Ionicons name="document-text-outline" size={12} color={Colors.gray} />
                    <Text style={styles.catMetaText}>
                      {item.totalCasos} {item.totalCasos === 1 ? 'caso' : 'casos'}
                    </Text>
                  </View>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={accent.color}
                  style={{ opacity: 0.7 }}
                />
              </TouchableOpacity>
            );
          }}
          ListFooterComponent={
            <View style={styles.infoCard}>
              <Ionicons name="information-circle-outline" size={18} color={Colors.primary} />
              <Text style={styles.infoTexto}>
                Los casos están basados en guías clínicas de referencia internacional.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // ── Estados ────────────────────────────────────────────────────────────────
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    padding: Spacing.xxxl,
  },
  loadingText: { ...Typography.bodySmall, color: Colors.gray },
  errorText: {
    ...Typography.body,
    color: Colors.danger,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
  retryBtn: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.medium,
    marginTop: Spacing.xs,
  },
  retryText: { color: Colors.white, fontWeight: '600', fontSize: 14 },

  // ── Lista ──────────────────────────────────────────────────────────────────
  lista: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    gap: Spacing.md,
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.rounded,
    padding: Spacing.xl,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
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
  heroTextBlock: { flex: 1, gap: 4 },
  heroEyebrow: {
    ...Typography.labelSmall,
    color: Colors.accentLight,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  heroTitle: { ...Typography.h4, color: Colors.white },
  heroSub: { ...Typography.bodySmall, color: 'rgba(255,255,255,0.85)' },
  heroIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Tarjeta de categoría ───────────────────────────────────────────────────
  catCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.large,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderLeftWidth: 4,
    ...Shadows.medium,
  },
  catIconWrap: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.rounded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catEmoji: { fontSize: 26 },
  catTexts: { flex: 1, gap: 3 },
  catNombre: { fontSize: 15, fontWeight: '700' },
  catDesc: { ...Typography.bodySmall, color: Colors.gray, lineHeight: 18 },
  catMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  catMetaText: { ...Typography.bodySmall, color: Colors.gray },

  // ── Info footer ────────────────────────────────────────────────────────────
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },
  infoTexto: {
    flex: 1,
    ...Typography.bodySmall,
    color: Colors.primary,
    lineHeight: 18,
  },
});
