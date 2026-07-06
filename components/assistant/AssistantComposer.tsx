import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../constants/theme';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export function AssistantComposer({ value, onChange, onSubmit, loading }: Props) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.composer}>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="Escribe tu consulta clínica..."
          placeholderTextColor={Colors.gray}
          style={styles.input}
          multiline
          textAlignVertical="top"
          editable={!loading}
        />
        <TouchableOpacity
          onPress={onSubmit}
          style={[styles.sendButton, (!value.trim() || loading) && styles.sendButtonDisabled]}
          activeOpacity={0.82}
          disabled={!value.trim() || loading}
        >
          <Ionicons name={loading ? 'time-outline' : 'arrow-up'} size={18} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.md,
  },
  composer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.large,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
    ...Shadows.medium,
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    color: Colors.dark,
    ...Typography.body,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.disabled,
  },
});
