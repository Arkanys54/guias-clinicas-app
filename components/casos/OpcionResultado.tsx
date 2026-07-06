import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Colors, Shadows, Spacing } from '../../constants/theme';
import { OpcionRespuestaResultadoDto } from '../../services/api.types';

interface Props {
  opcion: OpcionRespuestaResultadoDto;
  seleccionada: boolean;
}

export function OpcionResultado({ opcion, seleccionada }: Props) {
  const esCorrecta  = opcion.esCorrecta;
  const esIncorrecta = seleccionada && !esCorrecta;

  let bg          = Colors.surface;
  let borderColor = Colors.border;
  let iconName: keyof typeof Ionicons.glyphMap = 'ellipse-outline';
  let iconColor   = Colors.gray;

  if (esCorrecta) {
    bg = '#F0FDF4'; borderColor = '#16A34A';
    iconName = 'checkmark-circle'; iconColor = '#16A34A';
  } else if (esIncorrecta) {
    bg = '#FFF1F2'; borderColor = '#E11D48';
    iconName = 'close-circle'; iconColor = '#E11D48';
  }

  return (
    <View style={[styles.opcion, { backgroundColor: bg, borderColor }]}>
      <View style={[
        styles.letraWrap,
        esCorrecta  && styles.letraCorrectaWrap,
        esIncorrecta && styles.letraIncorrectaWrap,
      ]}>
        <Text style={[styles.letra, (esCorrecta || esIncorrecta) && { color: Colors.white }]}>
          {opcion.letra}
        </Text>
      </View>
      <Text style={[
        styles.texto,
        esCorrecta  && { color: '#14532D', fontWeight: '600' as const },
        esIncorrecta && { color: '#881337' },
      ]}>
        {opcion.texto}
      </Text>
      <Ionicons name={iconName} size={20} color={iconColor} style={{ marginLeft: 'auto' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
    borderWidth: 1.5,
    ...Shadows.small,
  },
  letraWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letraCorrectaWrap:  { backgroundColor: Colors.success },
  letraIncorrectaWrap:{ backgroundColor: Colors.danger },
  letra: { fontSize: 13, fontWeight: '700', color: Colors.darkGray },
  texto: { flex: 1, fontSize: 14, color: Colors.darkGray, lineHeight: 20 },
});