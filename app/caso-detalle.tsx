import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '../components/Appheader';
import { CasoContenido } from '../components/casos/CasoContenido';
import { PantallaEspera } from '../components/casos/PantallaEspera';
import { BorderRadius, Colors, Spacing, Typography } from '../constants/theme';
import { useCasoDetalle } from '../hooks/useCasoDetalle';
import { getBottomViewportInset } from '../utils/layout';

export default function CasoDetalleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomInset = getBottomViewportInset(insets.bottom);
  const { id, titulo } = useLocalSearchParams<{ id: string; titulo: string }>();

  const {
    scrollRef,
    estado,
    caso,
    errorMsg,
    opcionId,
    setOpcionId,
    resultado,
    reintentando,
    minutosRestantes,
    cargar,
    cargarParaReintento,
    enviarRespuesta,
  } = useCasoDetalle(id);

  return (
    <View style={styles.container}>
      <AppHeader
        titulo={titulo ?? 'Caso Clínico'}
        icono="document-text-outline"
        accionIzquierda={{ icono: 'arrow-back', onPress: () => router.back() }}
        mostrarPerfil={false}
        accionDerecha={
          reintentando ? (
            <View style={styles.reintentoChip}>
              <Ionicons name="refresh" size={12} color={Colors.white} />
              <Text style={styles.reintentoChipText}>Reintento</Text>
            </View>
          ) : undefined
        }
      />

      {/* ── Cargando ─────────────────────────────────────────────────────── */}
      {estado === 'cargando' && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Cargando caso…</Text>
        </View>
      )}

      {/* ── Error ────────────────────────────────────────────────────────── */}
      {estado === 'error' && (
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.danger} />
          <Text style={styles.errorText}>{errorMsg}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={cargar}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Ya respondido / espera ────────────────────────────────────────── */}
      {estado === 'yaRespondido' && (
        <PantallaEspera
          minutosRestantes={minutosRestantes}
          onReintentar={cargarParaReintento}
          onVolver={() => router.back()}
        />
      )}

      {/* ── Caso (listo / enviando / resultado) ──────────────────────────── */}
      {(estado === 'listo' || estado === 'enviando' || estado === 'resultado') && caso && (
        <CasoContenido
          scrollRef={scrollRef}
          bottomInset={bottomInset}
          caso={caso}
          estado={estado}
          opcionId={opcionId}
          resultado={resultado}
          reintentando={reintentando}
          onSelectOpcion={setOpcionId}
          onEnviar={enviarRespuesta}
          onVolver={() => router.back()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    padding: 32,
  },
  loadingText: { ...Typography.bodySmall, color: Colors.gray },
  errorText:   { ...Typography.body, color: Colors.danger, textAlign: 'center' },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.medium,
    marginTop: Spacing.sm,
  },
  retryText: { color: Colors.white, fontWeight: '600', fontSize: 14 },

  reintentoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: BorderRadius.small,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  reintentoChipText: { fontSize: 11, fontWeight: '700', color: Colors.white },
});
