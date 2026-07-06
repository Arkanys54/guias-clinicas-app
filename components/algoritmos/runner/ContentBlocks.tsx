import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../../constants/theme';
import type { BloqueContenidoDefinicionDto } from '../../../services/algoritmos.types';

interface Props {
  blocks: BloqueContenidoDefinicionDto[];
  tone?: 'result' | 'info' | 'alert';
}

export function ContentBlocks({ blocks, tone = 'info' }: Props) {
  return (
    <View style={styles.list}>
      {blocks.map((block, index) => (
        <View
          key={`${block.tipo}-${index}`}
          style={[
            styles.block,
            block.tipo === 'alerta' && styles.blockAlert,
            block.tipo === 'tratamiento' && styles.blockTreatment,
            block.tipo === 'titulo' && styles.blockTitle,
            tone === 'alert' && styles.blockAlertTone,
            block.colorFondo ? { backgroundColor: block.colorFondo } : null,
          ]}
        >
          {!!block.titulo && <Text style={styles.blockHeading}>{block.titulo}</Text>}

          {block.tipo === 'titulo' ? (
            <Text style={styles.titleText}>{block.contenido}</Text>
          ) : block.tipo === 'divisor' ? (
            <View style={styles.divider} />
          ) : block.tipo === 'bala' ? (
            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.blockText}>{block.contenido}</Text>
            </View>
          ) : (
            <Text style={styles.blockText}>{block.contenido}</Text>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.md,
  },
  block: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.large,
    padding: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.lightGray,
  },
  blockAlert: {
    borderLeftColor: Colors.warning,
    backgroundColor: '#FFF8EB',
  },
  blockTreatment: {
    borderLeftColor: Colors.success,
    backgroundColor: '#EDF9F1',
  },
  blockTitle: {
    borderLeftColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  blockAlertTone: {
    borderLeftColor: Colors.danger,
  },
  blockHeading: {
    ...Typography.label,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  titleText: {
    ...Typography.h4,
    color: Colors.dark,
  },
  blockText: {
    ...Typography.bodySmall,
    color: Colors.dark,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  bullet: {
    ...Typography.body,
    color: Colors.primaryDark,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
});
