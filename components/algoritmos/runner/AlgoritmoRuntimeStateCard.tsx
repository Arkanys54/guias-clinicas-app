import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../../constants/theme';

interface Props {
  context: Record<string, unknown>;
  responses: Record<string, unknown>;
}

export function AlgoritmoRuntimeStateCard({ context, responses }: Props) {
  const contextEntries = Object.entries(context);
  const responseEntries = Object.entries(responses);

  if (contextEntries.length === 0 && responseEntries.length === 0) {
    return null;
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Estado actual</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Variables de contexto</Text>
        {contextEntries.length === 0 ? (
          <Text style={styles.emptyText}>Todavía no se han generado variables.</Text>
        ) : (
          <View style={styles.tokensWrap}>
            {contextEntries.map(([key, value]) => (
              <View key={`ctx-${key}`} style={[styles.token, styles.contextToken]}>
                <Text style={styles.tokenKey}>{key}</Text>
                <Text style={styles.tokenValue}>{formatValue(value)}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Respuestas registradas</Text>
        {responseEntries.length === 0 ? (
          <Text style={styles.emptyText}>Aún no has respondido nodos interactivos.</Text>
        ) : (
          <View style={styles.tokensWrap}>
            {responseEntries.map(([key, value]) => (
              <View key={`rsp-${key}`} style={[styles.token, styles.responseToken]}>
                <Text style={styles.tokenKey}>{key}</Text>
                <Text style={styles.tokenValue}>{formatValue(value)}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

function formatValue(value: unknown): string {
  if (Array.isArray(value)) return value.join(', ');
  if (value === null || value === undefined || value === '') return 'vacio';
  return String(value);
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.large,
    padding: Spacing.lg,
    gap: Spacing.lg,
    ...Shadows.medium,
  },
  title: {
    ...Typography.label,
    color: Colors.dark,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  section: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.bodySmall,
    color: Colors.darkGray,
    fontWeight: '700',
  },
  emptyText: {
    ...Typography.bodyXSmall,
    color: Colors.gray,
  },
  tokensWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  token: {
    width: '48%',
    borderRadius: BorderRadius.medium,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
  },
  contextToken: {
    backgroundColor: '#F3E8FF',
    borderColor: '#D8B4FE',
  },
  responseToken: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  tokenKey: {
    ...Typography.caption,
    color: Colors.darkGray,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  tokenValue: {
    ...Typography.bodySmall,
    color: Colors.dark,
    marginTop: 2,
    fontWeight: '600',
  },
});
