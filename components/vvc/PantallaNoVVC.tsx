import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/theme';
import { Bullet, sh } from './VvcShared';
import { s } from './vvcStyles';

const ALTERNATIVAS = [
  'Vaginosis bacteriana (Gardnerella vaginalis) - flujo grisaceo, olor a pescado, pH >4.5',
  'Tricomoniasis (Trichomonas vaginalis) - flujo amarillo-verdoso, espumoso, prurito intenso',
  'Dermatitis de contacto o vulvitis alergica - sin flujo caracteristico',
  'Infeccion mixta - puede requerir tratamiento combinado',
  'Vaginitis atrofica - posmenopausicas, sequedad y dispareunia',
  'Vaginitis citolitica - proliferacion de lactobacilos, similar a VVC',
];

export function PantallaNoVVC({ onReset }: { onReset: () => void }) {
  return (
    <View style={[s.step, { alignItems: 'center' }]}>
      <View style={[s.iconBox, { backgroundColor: '#FEF2F2', width: 80, height: 80, borderRadius: 40, alignSelf: 'center' }]}>
        <Ionicons name="ban-outline" size={40} color={Colors.danger} />
      </View>
      <Text style={[s.title, { textAlign: 'center' }]}>Cuadro no compatible con VVC</Text>
      <Text style={[s.sub, { textAlign: 'center' }]}>
        Los sintomas no corresponden a vulvovaginitis candidiasica. Considerar diagnosticos alternativos:
      </Text>
      <View style={[s.card, { width: '100%' }]}>
        {ALTERNATIVAS.map((txt, i) => <Bullet key={i} text={txt} />)}
      </View>
      <TouchableOpacity style={s.btnReset} onPress={onReset} activeOpacity={0.7}>
        <Ionicons name="refresh-outline" size={16} color={Colors.white} />
        <Text style={sh.btnNextTxt}>Nueva evaluacion</Text>
      </TouchableOpacity>
    </View>
  );
}