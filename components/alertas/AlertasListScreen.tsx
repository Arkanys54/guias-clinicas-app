import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '../Appheader';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../constants/theme';
import { useAlertasClinicas, type FiltroAlertasClinicas } from '../../hooks/useAlertasClinicas';
import { useAlertasClinicasCenter } from '../../context/AlertasClinicasContext';
import { AlertaCard } from './AlertaCard';
import { formatearFechaRelativa } from '../../utils/alertas/formatters';
import { getBottomViewportInset } from '../../utils/layout';

const FILTROS: { key: FiltroAlertasClinicas; label: string }[] = [
  { key: 'pendientes', label: 'Pendientes' },
  { key: 'no-leidas', label: 'No leídas' },
  { key: 'criticas', label: 'Críticas' },
  { key: 'todas', label: 'Todas' },
];

export function AlertasListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomInset = getBottomViewportInset(insets.bottom);
  const {
    alertas,
    filtro,
    setFiltro,
    resumen,
    cargando,
    refreshing,
    error,
    recargar,
  } = useAlertasClinicas();
  const { lastSyncAt, syncInProgress, pushRegistrationError } = useAlertasClinicasCenter();

  return (
    <View style={styles.container}>
      <AppHeader
        titulo="Alertas Clínicas"
        icono="notifications-outline"
        accionIzquierda={{ icono: 'arrow-back', onPress: () => router.back() }}
      />

      <FlatList
        data={alertas}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={recargar}
            tintColor={Colors.primary}
          />
        }
        contentContainerStyle={[styles.content, { paddingBottom: bottomInset }]}
        ListHeaderComponent={(
          <View style={styles.headerBlock}>
            <View style={styles.heroCard}>
              <View pointerEvents="none" style={styles.heroDecor} />
              <View style={styles.heroTitleRow}>
                <View style={styles.heroIconWrap}>
                  <Ionicons name="notifications-outline" size={20} color={Colors.white} />
                </View>
                <View style={styles.heroTextBlock}>
                  <Text style={styles.heroEyebrow}>Monitoreo reactivo</Text>
                  <Text style={styles.heroTitle}>Resultados y alertas del médico</Text>
                </View>
              </View>

              <Text style={styles.heroDescription}>
                Recibe alertas clínicas en las notificaciones del dispositivo y consulta aquí los resultados pendientes con sus recomendaciones asociadas.
              </Text>

              <View style={styles.metricsRow}>
                <MetricCard label="Pendientes" value={resumen.pendientes} />
                <MetricCard label="No leídas" value={resumen.noLeidas} />
                <MetricCard label="Críticas" value={resumen.criticas} />
              </View>

              <Text style={styles.syncText}>
                {lastSyncAt
                  ? `Última sincronización ${formatearFechaRelativa(lastSyncAt)}${syncInProgress ? ' · actualizando...' : ''}`
                  : syncInProgress
                    ? 'Sincronizando alertas...'
                    : 'Esperando primera sincronización...'}
              </Text>
            </View>

            <View style={styles.filtersRow}>
              {FILTROS.map((item) => {
                const activo = item.key === filtro;
                return (
                  <TouchableOpacity
                    key={item.key}
                    style={[styles.filterChip, activo && styles.filterChipActive]}
                    onPress={() => setFiltro(item.key)}
                    activeOpacity={0.82}
                  >
                    <Text style={[styles.filterChipText, activo && styles.filterChipTextActive]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {!!error && (
              <View style={styles.errorCard}>
                <Ionicons name="warning-outline" size={18} color={Colors.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {!!pushRegistrationError && (
              <View style={styles.errorCard}>
                <Ionicons name="notifications-off-outline" size={18} color={Colors.danger} />
                <Text style={styles.errorText}>{pushRegistrationError}</Text>
              </View>
            )}
          </View>
        )}
        renderItem={({ item }) => (
          <AlertaCard
            alerta={item}
            onPress={() =>
              router.push({
                pathname: '/alertas/[alertaId]' as Href,
                params: { alertaId: String(item.id) },
              } as Href)
            }
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
        ListEmptyComponent={
          cargando ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Cargando alertas clínicas...</Text>
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Ionicons name="checkmark-done-outline" size={38} color={Colors.success} />
              <Text style={styles.emptyTitle}>No hay alertas en este filtro</Text>
              <Text style={styles.emptyDescription}>
                Cuando lleguen nuevos eventos clínicos para tus pacientes, aparecerán aquí.
              </Text>
            </View>
          )
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
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
    paddingTop: Spacing.xl,
  },
  headerBlock: {
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  heroCard: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.rounded,
    padding: Spacing.xl,
    gap: Spacing.md,
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
  heroTitleRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  heroIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTextBlock: {
    flex: 1,
    gap: 2,
  },
  heroEyebrow: {
    ...Typography.labelSmall,
    color: Colors.accentLight,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  heroTitle: {
    ...Typography.h4,
    color: Colors.white,
  },
  heroDescription: {
    ...Typography.bodySmall,
    color: 'rgba(255,255,255,0.85)',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  metricCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: BorderRadius.medium,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
  },
  metricValue: {
    ...Typography.h4,
    color: Colors.white,
  },
  metricLabel: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.8)',
  },
  syncText: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.7)',
  },
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.rounded,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    ...Typography.bodySmall,
    color: Colors.dark,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: Colors.white,
  },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: '#FCE8E6',
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
  },
  errorText: {
    flex: 1,
    ...Typography.bodySmall,
    color: Colors.danger,
  },
  loadingWrap: {
    paddingVertical: Spacing.xxxl,
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    ...Typography.bodySmall,
    color: Colors.darkGray,
  },
  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.large,
    padding: Spacing.xxl,
    alignItems: 'center',
    gap: Spacing.md,
  },
  emptyTitle: {
    ...Typography.h4,
    color: Colors.dark,
    textAlign: 'center',
  },
  emptyDescription: {
    ...Typography.bodySmall,
    color: Colors.darkGray,
    textAlign: 'center',
  },
});
