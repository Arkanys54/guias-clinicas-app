import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../constants/theme';
import type { AlgoritmoClinicoCatalogoDto } from '../../services/algoritmos.types';

interface Props {
  algoritmo: AlgoritmoClinicoCatalogoDto;
  onPress: () => void;
}

export function AlgoritmoCard({ algoritmo, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.iconWrap}>
        <Ionicons name="pulse-outline" size={22} color={Colors.primary} />
      </View>

      <View style={styles.body}>
        <View style={styles.headerRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{algoritmo.categoriaNombre || algoritmo.categoriaClave || 'General'}</Text>
          </View>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>{algoritmo.versionClave}</Text>
          </View>
        </View>

        <Text style={styles.title}>{algoritmo.nombre}</Text>
        {!!algoritmo.descripcion && (
          <Text style={styles.description} numberOfLines={3}>
            {algoritmo.descripcion}
          </Text>
        )}

        <View style={styles.footer}>
          <Text style={styles.meta}>Versión {algoritmo.numeroVersion}</Text>
          <Ionicons name="chevron-forward" size={18} color={Colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.large,
    padding: Spacing.lg,
    flexDirection: 'row',
    gap: Spacing.md,
    ...Shadows.medium,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.rounded,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: Spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  categoryBadge: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.rounded,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
  },
  categoryText: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  versionBadge: {
    backgroundColor: Colors.accentLight,
    borderRadius: BorderRadius.rounded,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
  },
  versionText: {
    ...Typography.caption,
    color: Colors.accentDark,
    fontWeight: '700',
  },
  title: {
    ...Typography.h4,
    color: Colors.dark,
  },
  description: {
    ...Typography.bodySmall,
    color: Colors.darkGray,
  },
  footer: {
    marginTop: Spacing.xs,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meta: {
    ...Typography.caption,
    color: Colors.gray,
    fontWeight: '600',
  },
});
