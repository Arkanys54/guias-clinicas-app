import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '../Appheader';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../constants/theme';
import { useAlertaClinicaDetalle } from '../../hooks/useAlertaClinicaDetalle';
import { AlertaLevelBadge } from './AlertaLevelBadge';
import { AlertaRecommendationCard } from './AlertaRecommendationCard';
import { formatearFechaLarga } from '../../utils/alertas/formatters';
import { getBottomViewportInset } from '../../utils/layout';

interface Props {
  alertaId: number | null;
}

export function AlertaDetalleScreen({ alertaId }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomInset = getBottomViewportInset(insets.bottom);
  const { alerta, cargando, resolviendo, error, recargar, resolver } = useAlertaClinicaDetalle(alertaId);

  const abrirAlgoritmo = () => {
    if (!alerta?.algoritmoSugeridoId) return;
    router.push({
      pathname: '/algoritmos/[algoritmoId]' as Href,
      params: { algoritmoId: String(alerta.algoritmoSugeridoId) },
    } as Href);
  };

  const consultarIa = () => {
    if (!alerta) return;

    const mensaje = [
      `Analiza esta alerta clínica.`,
      `Paciente: ${alerta.pacienteNombre}.`,
      `Alerta: ${alerta.titulo}.`,
      `Mensaje: ${alerta.mensaje}.`,
      alerta.terminoInterpretado ? `Hallazgo probable: ${alerta.terminoInterpretado}.` : '',
    ]
      .filter(Boolean)
      .join(' ');

    router.push({
      pathname: '/asistente' as Href,
      params: {
        mensaje,
        enviar: '1',
      },
    } as Href);
  };

  return (
    <View style={styles.container}>
      <AppHeader
        titulo="Detalle de alerta"
        icono="notifications-outline"
        accionIzquierda={{ icono: 'arrow-back', onPress: () => router.back() }}
        mostrarPerfil={false}
      />

      {cargando ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Cargando detalle de alerta...</Text>
        </View>
      ) : !alerta ? (
        <View style={styles.centered}>
          <Ionicons name="warning-outline" size={34} color={Colors.danger} />
          <Text style={styles.errorTitle}>No se pudo abrir la alerta</Text>
          <Text style={styles.errorText}>{error ?? 'La alerta solicitada no está disponible.'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={recargar} activeOpacity={0.82}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: bottomInset }]} showsVerticalScrollIndicator={false}>
          <View style={styles.heroCard}>
            <View style={styles.heroHeader}>
              <View style={styles.heroTitleBlock}>
                <Text style={styles.heroTitle}>{alerta.titulo}</Text>
                <Text style={styles.heroSubtitle}>{alerta.pacienteNombre}</Text>
              </View>
              <AlertaLevelBadge nivel={alerta.nivel} />
            </View>

            <Text style={styles.heroMessage}>{alerta.mensaje}</Text>

            <View style={styles.metaGrid}>
              <MetaItem label="Estado" value={alerta.resuelta ? 'Resuelta' : 'Pendiente'} />
              <MetaItem label="Leída" value={alerta.leida ? 'Sí' : 'No'} />
              <MetaItem label="Fecha" value={formatearFechaLarga(alerta.fechaCreacion)} />
              <MetaItem label="Hallazgo" value={alerta.terminoInterpretado || alerta.hallazgoClave || 'No identificado'} />
            </View>
          </View>

          <View style={styles.actionsRow}>
            {!!alerta.algoritmoSugeridoId && (
              <ActionButton
                icon="pulse-outline"
                label={alerta.algoritmoSugeridoNombre || 'Abrir algoritmo'}
                onPress={abrirAlgoritmo}
                tone="primary"
              />
            )}
            <ActionButton
              icon="chatbubbles-outline"
              label="Consultar IA"
              onPress={consultarIa}
              tone="secondary"
            />
          </View>

          {!alerta.resuelta && (
            <TouchableOpacity
              style={[styles.resolveButton, resolviendo && styles.resolveButtonDisabled]}
              onPress={() => void resolver()}
              disabled={resolviendo}
              activeOpacity={0.82}
            >
              <Ionicons name="checkmark-done-outline" size={18} color={Colors.white} />
              <Text style={styles.resolveText}>
                {resolviendo ? 'Resolviendo...' : 'Marcar como resuelta'}
              </Text>
            </TouchableOpacity>
          )}

          {!!alerta.eventoClinico && (
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Evento clínico recibido</Text>
              <Text style={styles.sectionBody}>
                {alerta.eventoClinico.tipoEvento}
                {alerta.eventoClinico.subtipo ? ` · ${alerta.eventoClinico.subtipo}` : ''}
              </Text>
              <Text style={styles.eventValue}>
                {alerta.eventoClinico.valorPrincipal}
                {alerta.eventoClinico.unidad ? ` ${alerta.eventoClinico.unidad}` : ''}
              </Text>
              <Text style={styles.sectionCaption}>
                Origen: {alerta.eventoClinico.origen} · {formatearFechaLarga(alerta.eventoClinico.fechaEvento)}
              </Text>
            </View>
          )}

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Recomendaciones sugeridas</Text>
            {alerta.recomendaciones.length ? (
              <View style={styles.recommendationsList}>
                {alerta.recomendaciones.map((recomendacion) => (
                  <AlertaRecommendationCard
                    key={recomendacion.recomendacionId}
                    recomendacion={recomendacion}
                  />
                ))}
              </View>
            ) : (
              <Text style={styles.emptyRecommendations}>
                Esta alerta aún no tiene recomendaciones clínicas estructuradas asociadas.
              </Text>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaItem}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

function ActionButton({
  icon,
  label,
  onPress,
  tone,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  tone: 'primary' | 'secondary';
}) {
  return (
    <TouchableOpacity
      style={[styles.actionButton, tone === 'primary' ? styles.actionPrimary : styles.actionSecondary]}
      onPress={onPress}
      activeOpacity={0.82}
    >
      <Ionicons
        name={icon}
        size={18}
        color={tone === 'primary' ? Colors.white : Colors.primaryDark}
      />
      <Text style={[styles.actionText, tone === 'primary' ? styles.actionTextPrimary : styles.actionTextSecondary]}>
        {label}
      </Text>
    </TouchableOpacity>
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
    gap: Spacing.lg,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  loadingText: {
    ...Typography.bodySmall,
    color: Colors.darkGray,
  },
  errorTitle: {
    ...Typography.h4,
    color: Colors.dark,
    textAlign: 'center',
  },
  errorText: {
    ...Typography.bodySmall,
    color: Colors.darkGray,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.medium,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  retryText: {
    ...Typography.bodySmall,
    color: Colors.white,
    fontWeight: '700',
  },
  heroCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.large,
    padding: Spacing.xl,
    gap: Spacing.md,
    ...Shadows.medium,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
    alignItems: 'flex-start',
  },
  heroTitleBlock: {
    flex: 1,
    gap: 4,
  },
  heroTitle: {
    ...Typography.h4,
    color: Colors.dark,
  },
  heroSubtitle: {
    ...Typography.bodySmall,
    color: Colors.darkGray,
  },
  heroMessage: {
    ...Typography.body,
    color: Colors.dark,
    lineHeight: 24,
  },
  metaGrid: {
    gap: Spacing.md,
  },
  metaItem: {
    gap: 2,
  },
  metaLabel: {
    ...Typography.caption,
    color: Colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  metaValue: {
    ...Typography.bodySmall,
    color: Colors.dark,
    fontWeight: '600',
  },
  actionsRow: {
    gap: Spacing.md,
  },
  actionButton: {
    borderRadius: BorderRadius.large,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
  },
  actionPrimary: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  actionSecondary: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  actionText: {
    ...Typography.bodySmall,
    fontWeight: '700',
  },
  actionTextPrimary: {
    color: Colors.white,
  },
  actionTextSecondary: {
    color: Colors.primaryDark,
  },
  resolveButton: {
    backgroundColor: Colors.accentDark,
    borderRadius: BorderRadius.large,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  resolveButtonDisabled: {
    opacity: 0.65,
  },
  resolveText: {
    ...Typography.bodySmall,
    color: Colors.white,
    fontWeight: '700',
  },
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.large,
    padding: Spacing.xl,
    gap: Spacing.md,
    ...Shadows.medium,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.dark,
  },
  sectionBody: {
    ...Typography.bodySmall,
    color: Colors.darkGray,
  },
  eventValue: {
    ...Typography.body,
    color: Colors.dark,
    fontWeight: '700',
  },
  sectionCaption: {
    ...Typography.caption,
    color: Colors.gray,
  },
  recommendationsList: {
    gap: Spacing.md,
  },
  emptyRecommendations: {
    ...Typography.bodySmall,
    color: Colors.darkGray,
  },
});
