import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../constants/theme';

interface Props {
  minutosRestantes: number | null;
  onReintentar: () => void;
  onVolver: () => void;
}

export function PantallaEspera({ minutosRestantes, onReintentar, onVolver }: Props) {
  const esperaActiva = minutosRestantes !== null && minutosRestantes > 0;
  const puedeReintentar = minutosRestantes === 0;

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="time-outline" size={40} color={Colors.primary} />
      </View>

      <Text style={styles.titulo}>Ya respondiste este caso</Text>

      {esperaActiva ? (
        <>
          <Text style={styles.sub}>Podrás cambiar tu respuesta en:</Text>
          <View style={styles.countdownBadge}>
            <Ionicons name="hourglass-outline" size={16} color={Colors.primary} />
            <Text style={styles.countdownText}>
              {minutosRestantes} {minutosRestantes === 1 ? 'minuto' : 'minutos'}
            </Text>
          </View>
          <Text style={styles.hint}>
            El tiempo de espera refuerza el aprendizaje antes de reintentar.
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.sub}>
            {puedeReintentar
              ? '¡Ya puedes cambiar tu respuesta!'
              : 'Si ha pasado más de una hora puedes volver a intentarlo.'}
          </Text>
          <TouchableOpacity style={styles.btnPrimario} onPress={onReintentar}>
            <Ionicons name="refresh" size={16} color={Colors.white} />
            <Text style={styles.btnPrimarioText}>Cambiar respuesta</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity
        style={[styles.btnOutline, { marginTop: Spacing.xs }]}
        onPress={onVolver}
      >
        <Text style={styles.btnOutlineText}>Volver al listado</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    padding: 32,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: { fontSize: 18, fontWeight: '700', color: Colors.dark, textAlign: 'center' },
  sub: { ...Typography.body, color: Colors.gray, textAlign: 'center', lineHeight: 22 },
  hint: {
    ...Typography.bodySmall,
    color: Colors.gray,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 16,
  },
  countdownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.medium,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  countdownText: { fontSize: 20, fontWeight: '700', color: Colors.primary },
  btnPrimario: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.medium,
  },
  btnPrimarioText: { color: Colors.white, fontWeight: '600', fontSize: 14 },
  btnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.medium,
  },
  btnOutlineText: { color: Colors.gray, fontWeight: '600', fontSize: 14 },
});