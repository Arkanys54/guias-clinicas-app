import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Colors, Spacing } from '../../constants/theme';
import { FACTORES, FactorId } from '../../constants/vvcTypes';
import { NavRow } from './VvcShared';
import { s } from './vvcStyles';

interface Props {
  sel: Set<FactorId>;
  onToggle: (id: FactorId) => void;
  onNext: () => void;
  onBack: () => void;
}

export function PasoFactores({ sel, onToggle, onNext, onBack }: Props) {
  return (
    <View style={s.step}>
      <View style={s.iconBox}>
        <Ionicons name="list-outline" size={30} color={Colors.primary} />
      </View>
      <Text style={s.title}>Factores clinicos</Text>
      <Text style={s.sub}>Selecciona todos los que apliquen a la paciente:</Text>
      <View style={{ gap: Spacing.sm }}>
        {FACTORES.map((f) => {
          const on = sel.has(f.id);
          return (
            <TouchableOpacity
              key={f.id}
              style={[s.checkRow, on && s.checkRowOn]}
              onPress={() => onToggle(f.id)}
              activeOpacity={0.7}
            >
              <View style={[s.chk, on && s.chkOn]}>
                {on && <Ionicons name="checkmark" size={13} color={Colors.white} />}
              </View>
              <Ionicons name={f.icono} size={18} color={on ? Colors.primary : Colors.gray} />
              <Text style={[s.checkLabel, on && s.checkLabelOn]}>{f.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {sel.size === 0 && <Text style={s.hint}>Sin factores seleccionados - VVC no complicada</Text>}
      <NavRow onBack={onBack} onNext={onNext} nextLabel="Ver recomendacion" />
    </View>
  );
}