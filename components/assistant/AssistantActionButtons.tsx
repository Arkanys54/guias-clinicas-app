import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../constants/theme';
import type { AssistantActionDto } from '../../services/assistant.types';

interface Props {
  actions: AssistantActionDto[];
  onPressAction: (action: AssistantActionDto) => void;
}

const getIcon = (type: string): keyof typeof Ionicons.glyphMap => {
  switch (type) {
    case 'open_algorithm':
      return 'pulse-outline';
    case 'open_search':
      return 'search-outline';
    case 'explain_current_node':
      return 'git-branch-outline';
    default:
      return 'open-outline';
  }
};

export function AssistantActionButtons({ actions, onPressAction }: Props) {
  if (!actions.length) return null;

  return (
    <View style={styles.actions}>
      {actions.slice(0, 3).map((action, index) => (
        <TouchableOpacity
          key={`${action.type}-${action.label}-${index}`}
          style={styles.actionButton}
          onPress={() => onPressAction(action)}
          activeOpacity={0.82}
        >
          <Ionicons name={getIcon(action.type)} size={16} color={Colors.primary} />
          <Text style={styles.actionText}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.rounded,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    alignSelf: 'flex-start',
  },
  actionText: {
    ...Typography.bodySmall,
    color: Colors.primaryDark,
    fontWeight: '600',
  },
});
