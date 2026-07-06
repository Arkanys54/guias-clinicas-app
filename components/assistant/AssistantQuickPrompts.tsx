import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../constants/theme';

interface Props {
  prompts: string[];
  onSelect: (prompt: string) => void;
}

export function AssistantQuickPrompts({ prompts, onSelect }: Props) {
  if (!prompts.length) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Consultas sugeridas</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
        {prompts.map((prompt, index) => (
          <TouchableOpacity
            key={`${prompt}-${index}`}
            style={styles.chip}
            onPress={() => onSelect(prompt)}
            activeOpacity={0.82}
          >
            <Text style={styles.chipText}>{prompt}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  label: {
    ...Typography.labelSmall,
    color: Colors.darkGray,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  content: {
    gap: Spacing.sm,
    paddingRight: Spacing.lg,
  },
  chip: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: BorderRadius.rounded,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    maxWidth: 280,
  },
  chipText: {
    ...Typography.bodySmall,
    color: Colors.accentDark,
  },
});
