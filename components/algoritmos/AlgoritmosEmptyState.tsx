import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../constants/theme';

interface Props {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function AlgoritmosEmptyState({ title, description, actionLabel, onAction }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons name="git-branch-outline" size={28} color={Colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity style={styles.button} onPress={onAction} activeOpacity={0.85}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: Spacing.xxl,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.large,
    padding: Spacing.xxl,
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Typography.h4,
    color: Colors.dark,
    textAlign: 'center',
  },
  description: {
    ...Typography.bodySmall,
    color: Colors.darkGray,
    textAlign: 'center',
  },
  button: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.rounded,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  buttonText: {
    ...Typography.bodySmall,
    color: Colors.white,
    fontWeight: '700',
  },
});
