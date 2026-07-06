import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppLogo } from './branding/AppLogo';
import { Colors, Spacing, Typography } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

interface AppHeaderProps {
  titulo: string;
  icono?: keyof typeof Ionicons.glyphMap;
  mostrarPerfil?: boolean;
  accionIzquierda?: {
    icono: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
  };
  accionDerecha?: React.ReactNode;
}

export function AppHeader({
  titulo,
  icono,
  mostrarPerfil = true,
  accionIzquierda,
  accionDerecha,
}: AppHeaderProps) {
  const router = useRouter();
  const { usuario } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
      {/* Detalle decorativo (moderno) */}
      <View pointerEvents="none" style={styles.decorCircle} />
      <View pointerEvents="none" style={styles.decorCircleSmall} />

      {accionIzquierda && (
        <TouchableOpacity
          style={styles.sideBtn}
          onPress={accionIzquierda.onPress}
          activeOpacity={0.75}
        >
          <Ionicons name={accionIzquierda.icono} size={22} color={Colors.white} />
        </TouchableOpacity>
      )}

      <View style={styles.center}>
        <View style={styles.brandRow}>
          <AppLogo variant="wordmark" width={82} height={20} />
        </View>
        <View style={styles.tituloRow}>
          {icono && (
            <Ionicons name={icono} size={20} color="rgba(255,255,255,0.85)" />
          )}
          <Text style={[Typography.h3, styles.titulo]} numberOfLines={1}>
            {titulo}
          </Text>
        </View>
        {!!usuario && (
          <Text style={[Typography.bodyXSmall, styles.subtitulo]} numberOfLines={1}>
            {usuario.nombre} {usuario.apellido}
          </Text>
        )}
      </View>

      <View style={styles.derechaWrap}>
        {accionDerecha}
        {mostrarPerfil && (
          <TouchableOpacity
            style={styles.sideBtn}
            onPress={() => router.push('/perfil')}
            activeOpacity={0.75}
          >
            <Ionicons name="person-outline" size={20} color={Colors.white} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
    paddingBottom: 22,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  decorCircle: {
    position: 'absolute',
    top: -46,
    right: -34,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: Colors.primaryDark,
    opacity: 0.4,
  },
  decorCircleSmall: {
    position: 'absolute',
    top: 24,
    right: 54,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.accent,
    opacity: 0.12,
  },
  center: {
    flex: 1,
  },
  brandRow: {
    marginBottom: 6,
    opacity: 0.96,
  },
  tituloRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  titulo: {
    color: Colors.white,
    fontSize: 20,
  },
  subtitulo: {
    color: 'rgba(255,255,255,0.7)',
    marginTop: 3,
    marginLeft: 2,
  },
  sideBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  derechaWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
});
