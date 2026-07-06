import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/theme';
import { DiagType, IoniconName } from '../../constants/vvcTypes';
import { AlertBox, NavRow, sh } from './VvcShared';
import { s } from './vvcStyles';

interface Props {
  diag: DiagType;
  setDiag: (d: DiagType) => void;
  onNext: () => void;
  onBack: () => void;
}

const OPTS: Array<{ id: DiagType; icono: IoniconName; label: string; desc: string; tag: string; bc: string; bg: string }> = [
  { id: 'microscopia', icono: 'search-outline',    label: 'Microscopia positiva',    desc: 'Pseudohifas o blastosporas en KOH / suero fisiologico', tag: 'Gold standard',      bc: Colors.primary, bg: Colors.primaryLight },
  { id: 'cultivo_pos', icono: 'flask-outline',     label: 'Cultivo positivo previo', desc: 'Crecimiento de Candida spp. en medio de cultivo',       tag: 'Alta especificidad', bc: '#0F766E',      bg: '#F0FDFA' },
  { id: 'clinico',     icono: 'clipboard-outline', label: 'Diagnostico clinico',     desc: 'Sin confirmacion de laboratorio - basado en sintomas',  tag: 'Menos preciso',     bc: Colors.warning, bg: '#FFFBEB' },
];

export function PasoDiagnostico({ diag, setDiag, onNext, onBack }: Props) {
  return (
    <View style={s.step}>
      <View style={s.iconBox}>
        <Ionicons name="search-outline" size={30} color={Colors.primary} />
      </View>
      <Text style={s.title}>Confirmacion diagnostica</Text>
      <Text style={s.sub}>Como se confirmo (o planea confirmar) el diagnostico?</Text>
      <View style={{ gap: 12 }}>
        {OPTS.map((o) => {
          const selected = diag === o.id;
          return (
            <TouchableOpacity
              key={String(o.id)}
              style={[s.diagBtn, { borderColor: selected ? o.bc : Colors.border, backgroundColor: selected ? o.bg : Colors.surface }]}
              onPress={() => setDiag(o.id)}
              activeOpacity={0.7}
            >
              <Ionicons name={o.icono} size={24} color={selected ? o.bc : Colors.gray} />
              <View style={{ flex: 1, gap: 3 }}>
                <View style={s.diagLabelRow}>
                  <Text style={[s.diagLabel, { color: selected ? o.bc : Colors.dark }]}>{o.label}</Text>
                  <View style={[s.diagTag, { backgroundColor: o.bc + '25' }]}>
                    <Text style={[s.diagTagTxt, { color: o.bc }]}>{o.tag}</Text>
                  </View>
                </View>
                <Text style={s.diagDesc}>{o.desc}</Text>
              </View>
              <View style={[s.radio, { borderColor: selected ? o.bc : Colors.gray, backgroundColor: selected ? o.bc : 'transparent' }]}>
                {selected && <Ionicons name="checkmark" size={12} color={Colors.white} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      {diag === 'clinico' && (
        <AlertBox icono="warning-outline" bg="#FFFBEB" border={Colors.warning}>
          <Text style={[sh.alertTxt, { color: Colors.dark }]}>
            <Text style={{ fontWeight: '700' }}>Diagnostico solo clinico es menos preciso.</Text>
            {' '}Los sintomas por si solos no diferencian bien los tipos de vaginitis. Se recomienda confirmar con microscopia o cultivo.
          </Text>
        </AlertBox>
      )}
      <NavRow
        onBack={onBack}
        onNext={diag ? onNext : () => {}}
        nextLabel="Evaluar factores"
        nextColor={diag ? Colors.primary : Colors.disabled}
      />
      {!diag && <Text style={s.hint}>Selecciona una opcion para continuar</Text>}
    </View>
  );
}