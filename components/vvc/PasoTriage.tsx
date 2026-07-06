import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Spacing } from '../../constants/theme';
import { IoniconName } from '../../constants/vvcTypes';
import { s } from './vvcStyles';

interface Props {
  onResp: (r: 'si' | 'no' | 'inseguro') => void;
}

const OPTS: Array<{ id: 'si' | 'no' | 'inseguro'; icono: IoniconName; label: string; desc: string; bc: string; bg: string }> = [
  { id: 'si',       icono: 'checkmark-circle-outline', label: 'Si',              desc: 'Prurito vulvar + flujo blanco espeso',             bc: Colors.success, bg: '#F0FDF4' },
  { id: 'no',       icono: 'close-circle-outline',     label: 'No',              desc: 'Cuadro no compatible con VVC',                     bc: Colors.danger,  bg: '#FEF2F2' },
  { id: 'inseguro', icono: 'help-circle-outline',      label: 'No estoy seguro', desc: 'Continuar evaluacion diagnostica de todas formas', bc: Colors.warning, bg: '#FFFBEB' },
];

export function PasoTriage({ onResp }: Props) {
  return (
    <View style={s.step}>
      <View style={s.iconBox}>
        <Ionicons name="medkit-outline" size={30} color={Colors.primary} />
      </View>
      <Text style={s.title}>Evaluacion inicial</Text>
      <Text style={s.sub}>
        La paciente presenta <Text style={s.bold}>prurito vulvar</Text> y{' '}
        <Text style={s.bold}>flujo vaginal blanco espeso</Text>?
      </Text>
      <View style={{ gap: Spacing.md }}>
        {OPTS.map((o) => (
          <TouchableOpacity
            key={o.id}
            style={[s.optBtn, { borderColor: o.bc, backgroundColor: o.bg }]}
            onPress={() => onResp(o.id)}
            activeOpacity={0.7}
          >
            <Ionicons name={o.icono} size={28} color={o.bc} />
            <View style={{ flex: 1 }}>
              <Text style={[s.optLabel, { color: o.bc }]}>{o.label}</Text>
              <Text style={s.optDesc}>{o.desc}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}