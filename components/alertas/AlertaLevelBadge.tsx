import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../constants/theme';

interface Props {
  nivel: string;
}

export function AlertaLevelBadge({ nivel }: Props) {
  const esAlta = nivel === 'alta';
  const esMedia = nivel === 'media';

  return (
    <View
      style={[
        styles.badge,
        esAlta ? styles.badgeHigh : esMedia ? styles.badgeMedium : styles.badgeLow,
      ]}
    >
      <Text
        style={[
          styles.text,
          esAlta ? styles.textHigh : esMedia ? styles.textMedium : styles.textLow,
        ]}
      >
        {nivel.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: BorderRadius.rounded,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  badgeHigh: {
    backgroundColor: '#FFF1D8',
  },
  badgeMedium: {
    backgroundColor: Colors.primaryLight,
  },
  badgeLow: {
    backgroundColor: Colors.surfaceLight,
  },
  text: {
    ...Typography.caption,
    fontWeight: '700',
  },
  textHigh: {
    color: Colors.warning,
  },
  textMedium: {
    color: Colors.primaryDark,
  },
  textLow: {
    color: Colors.darkGray,
  },
});

