import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../../constants/theme';
import type { DefinicionAlgoritmoDto, NodoAlgoritmoDefinicionDto } from '../../../services/algoritmos.types';

interface Props {
  currentNode: NodoAlgoritmoDefinicionDto;
  definition: DefinicionAlgoritmoDto;
  step: number;
  totalSteps: number;
}

export function AlgoritmoHeaderCard({ currentNode, definition, step, totalSteps }: Props) {
  const progress = totalSteps > 0 ? Math.min(100, Math.max(8, (step / totalSteps) * 100)) : 0;

  return (
    <View style={styles.card}>
      <View style={styles.badgesRow}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{definition.categoriaClave || 'general'}</Text>
        </View>
        <View style={styles.versionBadge}>
          <Text style={styles.versionText}>{definition.versionClave}</Text>
        </View>
      </View>

      <Text style={styles.title}>{definition.nombre}</Text>
      {!!definition.descripcion && <Text style={styles.description}>{definition.descripcion}</Text>}

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="git-branch-outline" size={14} color={Colors.primary} />
          <Text style={styles.metaText}>{currentNode.nombre || currentNode.clave}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="layers-outline" size={14} color={Colors.primary} />
          <Text style={styles.metaText}>
            Paso {step} de {Math.max(totalSteps, 1)}
          </Text>
        </View>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.large,
    padding: Spacing.xl,
    gap: Spacing.md,
    ...Shadows.medium,
  },
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.rounded,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
  },
  categoryText: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  versionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECFDF5',
    borderRadius: BorderRadius.rounded,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
  },
  versionText: {
    ...Typography.caption,
    color: Colors.success,
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
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    ...Typography.bodyXSmall,
    color: Colors.darkGray,
    fontWeight: '600',
  },
  progressTrack: {
    height: 8,
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.rounded,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.rounded,
  },
});
