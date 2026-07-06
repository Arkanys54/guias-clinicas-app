import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/theme';

interface AppLogoProps {
  variant?: 'wordmark' | 'symbol';
  width?: number;
  height?: number;
  padded?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

export function AppLogo({
  variant = 'wordmark',
  width,
  height,
  padded = false,
  containerStyle,
}: AppLogoProps) {
  const resolvedWidth = width ?? (variant === 'symbol' ? 42 : 126);
  const resolvedHeight = height ?? (variant === 'symbol' ? 34 : 32);
  const iconSize = Math.max(16, Math.min(resolvedWidth, resolvedHeight) * 0.72);

  if (variant === 'symbol') {
    return (
      <View
        style={[
          styles.symbol,
          { width: resolvedWidth, height: resolvedHeight },
          padded && styles.paddedContainer,
          containerStyle,
        ]}
      >
        <Ionicons name="medkit-outline" size={iconSize} color={Colors.primary} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.wordmark,
        { width: resolvedWidth, height: resolvedHeight },
        padded && styles.paddedContainer,
        containerStyle,
      ]}
    >
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.65}
        style={[styles.wordmarkText, { fontSize: Math.max(11, resolvedHeight * 0.62) }]}
      >
        Guías Clínicas
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  symbol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmarkText: {
    color: Colors.white,
    fontWeight: '800',
  },
  paddedContainer: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
