import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Shadows, Spacing } from '../../constants/theme';
import { OpcionRespuestaPublicaDto } from '../../services/api.types';

interface Props {
  opcion: OpcionRespuestaPublicaDto;
  seleccionada: boolean;
  deshabilitada: boolean;
  onSelect: () => void;
}

export function OpcionSelectable({ opcion, seleccionada, deshabilitada, onSelect }: Props) {
  return (
    <TouchableOpacity
      style={[styles.opcion, seleccionada && styles.opcionSeleccionada]}
      onPress={onSelect}
      disabled={deshabilitada}
      activeOpacity={0.8}
    >
      <View style={[styles.letraWrap, seleccionada && styles.letraActiva]}>
        <Text style={[styles.letra, seleccionada && styles.letraTextActiva]}>
          {opcion.letra}
        </Text>
      </View>
      <Text style={[styles.texto, seleccionada && styles.textoActivo]}>
        {opcion.texto}
      </Text>
      {seleccionada && (
        <Ionicons
          name="checkmark-circle"
          size={20}
          color={Colors.primary}
          style={{ marginLeft: 'auto' }}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadows.small,
  },
  opcionSeleccionada: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  letraWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letraActiva: { backgroundColor: Colors.primary },
  letra: { fontSize: 13, fontWeight: '700', color: Colors.darkGray },
  letraTextActiva: { color: Colors.white },
  texto: { flex: 1, fontSize: 14, color: Colors.darkGray, lineHeight: 20 },
  textoActivo: { color: Colors.primaryDark, fontWeight: '500' },
});