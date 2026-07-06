import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppLogo } from '../branding/AppLogo';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../constants/theme';

export function AssistantHeroCard() {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <AppLogo variant="symbol" width={30} height={24} />
      </View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.eyebrow}>Asistente clínico</Text>
          <Ionicons name="chatbubbles-outline" size={16} color={Colors.primaryDark} />
        </View>
        <Text style={styles.title}>Consulta guías, algoritmos y pasos activos desde una sola conversación.</Text>
        <Text style={styles.description}>
          El asistente usa el contexto estructurado del sistema y te devuelve acciones que la app puede ejecutar.
        </Text>
      </View>
    </View>
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
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  eyebrow: {
    ...Typography.labelSmall,
    color: Colors.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    ...Typography.h4,
    color: Colors.dark,
  },
  description: {
    ...Typography.bodySmall,
    color: Colors.darkGray,
  },
});
