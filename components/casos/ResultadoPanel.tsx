import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../constants/theme';
import { RespuestaResultadoDto } from '../../services/api.types';
import { OpcionResultado } from './OpcionResultado';

interface Props {
  resultado: RespuestaResultadoDto;
  esReintento: boolean;
  onVolver: () => void;
}

export function ResultadoPanel({ resultado, esReintento, onVolver }: Props) {
  const correcto = resultado.esCorrecta;

  return (
    <View style={[styles.card, correcto ? styles.cardCorrecto : styles.cardIncorrecto]}>
      {/* Cabecera */}
      <View style={styles.cabecera}>
        <View style={[styles.iconWrap, { backgroundColor: correcto ? '#16A34A' : '#E11D48' }]}>
          <Ionicons name={correcto ? 'checkmark' : 'close'} size={24} color={Colors.white} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.titulo, { color: correcto ? '#14532D' : '#881337' }]}>
            {correcto
              ? esReintento ? '¡Correcto en el reintento!' : '¡Respuesta correcta!'
              : esReintento ? 'Sigue sin ser la correcta'  : 'Respuesta incorrecta'}
          </Text>
          {!correcto && (
            <Text style={styles.subtitulo}>
              La respuesta correcta era la opción{' '}
              <Text style={{ fontWeight: '700' }}>{resultado.letraCorrecta}</Text>
            </Text>
          )}
        </View>
      </View>

      {/* Opciones con resultado */}
      <View style={styles.opciones}>
        {resultado.opciones.map((op) => (
          <OpcionResultado
            key={op.id}
            opcion={op}
            seleccionada={op.letra === resultado.letraSeleccionada}
          />
        ))}
      </View>

      {/* Justificación */}
      {!!resultado.justificacion && (
        <View style={styles.justificacionWrap}>
          <Text style={styles.justificacionLabel}>Justificación</Text>
          <Text style={styles.justificacionText}>{resultado.justificacion}</Text>
        </View>
      )}

      {/* Volver */}
      <TouchableOpacity style={styles.volverBtn} onPress={onVolver} activeOpacity={0.85}>
        <Ionicons name="arrow-back" size={16} color={Colors.white} />
        <Text style={styles.volverText}>Volver al listado</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.large,
    padding: Spacing.lg,
    gap: Spacing.md,
    marginTop: Spacing.sm,
    borderWidth: 1.5,
  },
  cardCorrecto:  { backgroundColor: '#F0FDF4', borderColor: '#86EFAC' },
  cardIncorrecto:{ backgroundColor: '#FFF1F2', borderColor: '#FECDD3' },

  cabecera: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo:   { fontSize: 17, fontWeight: '700' },
  subtitulo:{ ...Typography.bodySmall, color: Colors.gray, marginTop: 2 },

  opciones: { gap: Spacing.sm },

  justificacionWrap: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
    gap: Spacing.xs,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  justificacionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  justificacionText: { ...Typography.body, color: Colors.darkGray, lineHeight: 22 },

  volverBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.medium,
    paddingVertical: 12,
    marginTop: Spacing.xs,
  },
  volverText: { fontSize: 15, fontWeight: '600', color: Colors.white },
});