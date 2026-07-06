import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../constants/theme';
import { assistantActionPriority } from '../../hooks/useAssistantChat';
import type { AssistantActionDto, AssistantMessageItem } from '../../services/assistant.types';
import { AssistantActionButtons } from './AssistantActionButtons';

interface Props {
  item: AssistantMessageItem;
  onPressAction: (action: AssistantActionDto) => void;
}

export function AssistantMessageBubble({ item, onPressAction }: Props) {
  const isUser = item.role === 'user';
  const response = item.response;
  const visibleCitations = response?.citations?.slice(0, 2) ?? [];
  const shouldShowCitations = Boolean(
    visibleCitations.length &&
      (response?.intent === 'search' ||
        !response?.actions?.some((action) =>
          action.type === 'open_algorithm' || action.type === 'open_algorithms_catalog'))
  );

  return (
    <View style={[styles.row, isUser ? styles.rowRight : styles.rowLeft]}>
      {!isUser && (
        <View style={[styles.avatar, item.error ? styles.avatarError : styles.avatarAssistant]}>
          <Ionicons
            name={item.error ? 'alert-circle-outline' : 'sparkles-outline'}
            size={16}
            color={item.error ? Colors.danger : Colors.primary}
          />
        </View>
      )}

      <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
        {!isUser && response?.provider && (
          <Text style={styles.meta}>
            {response.fueGeneradoPorLlm ? `${response.provider} · ${response.model ?? 'modelo activo'}` : 'motor local'}
          </Text>
        )}

        <Text style={[styles.message, isUser && styles.messageUser]}>{item.text}</Text>

        {!!response?.advertencias?.length && (
          <View style={styles.warningCard}>
            {response.advertencias.slice(0, 2).map((warning, index) => (
              <Text key={`${warning}-${index}`} style={styles.warningText}>
                {warning}
              </Text>
            ))}
          </View>
        )}

        {shouldShowCitations && (
          <View style={styles.citations}>
            {visibleCitations.map((citation, index) => (
              <View key={`${citation.tipoFuente}-${citation.titulo}-${index}`} style={styles.citationCard}>
                <Text style={styles.citationTitle}>{citation.titulo}</Text>
                <Text style={styles.citationDescription} numberOfLines={2}>
                  {citation.descripcion}
                </Text>
              </View>
            ))}
          </View>
        )}

        {!!response?.actions?.length && (
          <AssistantActionButtons actions={assistantActionPriority(response.actions)} onPressAction={onPressAction} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-end',
  },
  rowLeft: {
    justifyContent: 'flex-start',
  },
  rowRight: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarAssistant: {
    backgroundColor: Colors.primaryLight,
  },
  avatarError: {
    backgroundColor: '#FCE8E6',
  },
  bubble: {
    maxWidth: '86%',
    borderRadius: BorderRadius.large,
    padding: Spacing.md,
  },
  assistantBubble: {
    backgroundColor: Colors.surface,
  },
  userBubble: {
    backgroundColor: Colors.primary,
  },
  meta: {
    ...Typography.caption,
    color: Colors.gray,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  message: {
    ...Typography.bodySmall,
    color: Colors.dark,
  },
  messageUser: {
    color: Colors.white,
  },
  warningCard: {
    marginTop: Spacing.sm,
    backgroundColor: '#FFF4E5',
    borderRadius: BorderRadius.medium,
    padding: Spacing.sm,
    gap: 4,
  },
  warningText: {
    ...Typography.caption,
    color: '#8A5A00',
  },
  citations: {
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  citationCard: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.medium,
    padding: Spacing.sm,
  },
  citationTitle: {
    ...Typography.label,
    color: Colors.dark,
  },
  citationDescription: {
    ...Typography.caption,
    color: Colors.darkGray,
  },
});
