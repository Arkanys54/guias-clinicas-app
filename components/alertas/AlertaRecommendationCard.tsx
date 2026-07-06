import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../constants/theme';
import type { RecomendacionDetalleDto } from '../../services/api.types';

interface Props {
  recomendacion: RecomendacionDetalleDto;
}

export function AlertaRecommendationCard({ recomendacion }: Props) {
  const abrirGuia = () => {
    if (!recomendacion.guiaClinica?.enlaceDocumento) return;
    Linking.openURL(recomendacion.guiaClinica.enlaceDocumento).catch(() => undefined);
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.priorityWrap}>
          <Ionicons
            name={recomendacion.prioridad >= 1 ? 'star' : 'bookmark-outline'}
            size={14}
            color={recomendacion.prioridad >= 1 ? Colors.warning : Colors.primary}
          />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>{recomendacion.titulo}</Text>
          {!!recomendacion.guiaClinica?.titulo && (
            <Text style={styles.guide}>{recomendacion.guiaClinica.titulo}</Text>
          )}
        </View>
      </View>

      <Text style={styles.text}>{recomendacion.texto}</Text>

      {!!recomendacion.justificacion && (
        <View style={styles.justificationBox}>
          <Text style={styles.justificationLabel}>Justificación clínica</Text>
          <Text style={styles.justificationText}>{recomendacion.justificacion}</Text>
        </View>
      )}

      {!!recomendacion.guiaClinica?.enlaceDocumento && (
        <TouchableOpacity style={styles.linkButton} onPress={abrirGuia} activeOpacity={0.82}>
          <Ionicons name="open-outline" size={15} color={Colors.primaryDark} />
          <Text style={styles.linkText}>Abrir guía fuente</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  priorityWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...Typography.label,
    color: Colors.dark,
  },
  guide: {
    ...Typography.caption,
    color: Colors.darkGray,
  },
  text: {
    ...Typography.bodySmall,
    color: Colors.dark,
    lineHeight: 20,
  },
  justificationBox: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.medium,
    padding: Spacing.sm,
    gap: 4,
  },
  justificationLabel: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  justificationText: {
    ...Typography.caption,
    color: Colors.darkGray,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.rounded,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  linkText: {
    ...Typography.bodySmall,
    color: Colors.primaryDark,
    fontWeight: '600',
  },
});

