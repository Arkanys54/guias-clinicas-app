import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../constants/theme';
import type { AlertaClinicaResumenDto } from '../../services/alertasClinicas.types';
import { formatearFechaRelativa } from '../../utils/alertas/formatters';
import { AlertaLevelBadge } from './AlertaLevelBadge';

interface Props {
  alerta: AlertaClinicaResumenDto;
  onPress: () => void;
}

export function AlertaCard({ alerta, onPress }: Props) {
  const esPendiente = !alerta.resuelta;
  const esNoLeida = !alerta.leida;
  const esAlta = alerta.nivel === 'alta';

  return (
    <TouchableOpacity
      style={[
        styles.card,
        esAlta ? styles.cardHigh : styles.cardNormal,
        esNoLeida && styles.cardUnread,
      ]}
      activeOpacity={0.88}
      onPress={onPress}
    >
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconWrap, esAlta ? styles.iconWrapHigh : styles.iconWrapNormal]}>
            <Ionicons
              name={esAlta ? 'warning-outline' : 'notifications-outline'}
              size={18}
              color={esAlta ? Colors.warning : Colors.primary}
            />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title} numberOfLines={2}>
              {alerta.titulo}
            </Text>
            <Text style={styles.patient} numberOfLines={1}>
              {alerta.pacienteNombre}
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          {esNoLeida && <View style={styles.unreadDot} />}
          <Ionicons name="chevron-forward" size={18} color={Colors.primary} />
        </View>
      </View>

      <Text style={styles.message} numberOfLines={3}>
        {alerta.mensaje}
      </Text>

      {!!alerta.resumenRecomendaciones && (
        <View style={styles.summaryBox}>
          <Ionicons name="medkit-outline" size={14} color={Colors.primaryDark} />
          <Text style={styles.summaryText} numberOfLines={2}>
            {alerta.resumenRecomendaciones}
          </Text>
        </View>
      )}

      <View style={styles.footerRow}>
        <View style={styles.badgesRow}>
          <AlertaLevelBadge nivel={alerta.nivel} />
          <View style={[styles.stateBadge, esPendiente ? styles.statePending : styles.stateResolved]}>
            <Text style={[styles.stateText, esPendiente ? styles.statePendingText : styles.stateResolvedText]}>
              {esPendiente ? 'PENDIENTE' : 'RESUELTA'}
            </Text>
          </View>
        </View>
        <Text style={styles.time}>{formatearFechaRelativa(alerta.fechaCreacion)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.large,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1,
    ...Shadows.medium,
  },
  cardHigh: {
    borderColor: '#F3D38A',
  },
  cardNormal: {
    borderColor: Colors.border,
  },
  cardUnread: {
    shadowOpacity: 0.16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flex: 1,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapHigh: {
    backgroundColor: '#FFF1D8',
  },
  iconWrapNormal: {
    backgroundColor: Colors.primaryLight,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...Typography.label,
    color: Colors.dark,
  },
  patient: {
    ...Typography.caption,
    color: Colors.darkGray,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.accent,
  },
  message: {
    ...Typography.bodySmall,
    color: Colors.dark,
    lineHeight: 20,
  },
  summaryBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.medium,
    padding: Spacing.sm,
  },
  summaryText: {
    flex: 1,
    ...Typography.caption,
    color: Colors.primaryDark,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  stateBadge: {
    borderRadius: BorderRadius.rounded,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
  },
  statePending: {
    backgroundColor: Colors.accentLight,
  },
  stateResolved: {
    backgroundColor: '#EAF8F1',
  },
  stateText: {
    ...Typography.caption,
    fontWeight: '700',
  },
  statePendingText: {
    color: Colors.accentDark,
  },
  stateResolvedText: {
    color: Colors.success,
  },
  time: {
    ...Typography.caption,
    color: Colors.gray,
  },
});

