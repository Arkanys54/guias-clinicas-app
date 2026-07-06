import { Href, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '../Appheader';
import { AppLogo } from '../branding/AppLogo';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../constants/theme';
import { useAlgoritmosCatalogo } from '../../hooks/useAlgoritmosCatalogo';
import { AlgoritmoCard } from './AlgoritmoCard';
import { AlgoritmosEmptyState } from './AlgoritmosEmptyState';
import { CategoriaFilterChips } from './CategoriaFilterChips';
import { getBottomViewportInset } from '../../utils/layout';

export function AlgoritmosCatalogoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomInset = getBottomViewportInset(insets.bottom);
  const {
    algoritmos,
    categoriaActiva,
    categorias,
    cargando,
    error,
    recargar,
    setCategoriaActiva,
  } = useAlgoritmosCatalogo();

  return (
    <View style={styles.container}>
      <AppHeader
        titulo="Algoritmos Clínicos"
        icono="pulse-outline"
        accionIzquierda={{ icono: 'arrow-back', onPress: () => router.back() }}
        mostrarPerfil={false}
      />

      <FlatList
        data={algoritmos}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[styles.content, { paddingBottom: bottomInset }]}
        refreshControl={<RefreshControl refreshing={cargando} onRefresh={recargar} tintColor={Colors.primary} />}
        ListHeaderComponent={(
          <View style={styles.headerBlock}>
            <View style={styles.hero}>
              <View pointerEvents="none" style={styles.heroDecor} />
              <View style={styles.heroTopRow}>
                <View style={styles.heroTextBlock}>
                  <Text style={styles.heroEyebrow}>Biblioteca dinámica</Text>
                  <Text style={styles.heroTitle}>Elige un algoritmo y sigue el flujo paso a paso.</Text>
                  <Text style={styles.heroDescription}>
                    Filtra por categoría y ejecuta la versión publicada más reciente disponible en la plataforma.
                  </Text>
                </View>
                <View style={styles.heroLogoWrap}>
                  <AppLogo variant="symbol" width={38} height={28} />
                </View>
              </View>
            </View>

            <CategoriaFilterChips
              categoriaActiva={categoriaActiva}
              categorias={categorias}
              onSelect={setCategoriaActiva}
            />

            {!cargando && (
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>{algoritmos.length}</Text>
                <Text style={styles.summaryLabel}>
                  {algoritmos.length === 1 ? 'algoritmo visible' : 'algoritmos visibles'}
                </Text>
              </View>
            )}
          </View>
        )}
        renderItem={({ item }) => (
          <AlgoritmoCard
            algoritmo={item}
            onPress={() =>
              router.push({
                pathname: '/algoritmos/[algoritmoId]' as Href,
                params: { algoritmoId: String(item.id) },
              } as Href)
            }
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
        ListEmptyComponent={
          cargando ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={styles.loadingText}>Cargando algoritmos...</Text>
            </View>
          ) : error ? (
            <AlgoritmosEmptyState
              title="No se pudieron cargar los algoritmos"
              description={error}
              actionLabel="Reintentar"
              onAction={recargar}
            />
          ) : (
            <AlgoritmosEmptyState
              title="Sin resultados en esta categoría"
              description="Prueba con otra categoría o espera a que se publiquen nuevos algoritmos."
            />
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  headerBlock: {
    gap: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  hero: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.rounded,
    padding: Spacing.xl,
    gap: Spacing.sm,
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
    gap: Spacing.md,
    alignItems: 'flex-start',
  },
  heroTextBlock: {
    flex: 1,
    gap: Spacing.sm,
  },
  heroLogoWrap: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEyebrow: {
    ...Typography.labelSmall,
    color: Colors.accentLight,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  heroTitle: {
    ...Typography.h4,
    color: Colors.white,
  },
  heroDescription: {
    ...Typography.bodySmall,
    color: 'rgba(255,255,255,0.85)',
  },
  summaryCard: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.large,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  summaryValue: {
    ...Typography.h4,
    color: Colors.primaryDark,
  },
  summaryLabel: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '600',
  },
  loadingWrap: {
    marginTop: Spacing.xxxl,
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    ...Typography.bodySmall,
    color: Colors.darkGray,
  },
});
