import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/theme';
import { DiagType, FactorId, IoniconName } from '../../constants/vvcTypes';
import { AlertBox, Bullet, CardTitle, Divider, NavRow, sh } from './VvcShared';
import { s } from './vvcStyles';

function GuiasBtn({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={gb.btn} onPress={onPress} activeOpacity={0.75}>
      <Ionicons name="document-text-outline" size={15} color={Colors.primary} />
      <Text style={gb.txt}>Ver fundamento académico</Text>
    </TouchableOpacity>
  );
}
const gb = StyleSheet.create({
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: Colors.primary, borderStyle: 'dashed', marginTop: 4 },
  txt: { fontSize: 13, fontWeight: '600', color: Colors.primary },
});

interface Props {
  factores: Set<FactorId>;
  diagType: DiagType;
  onReset: () => void;
  onBack: () => void;
  onVerFundamento: () => void;
}

export function PasoCultivo({ factores, diagType, onReset, onBack, onVerFundamento }: Props) {
  const f = (id: FactorId) => factores.has(id);
  const necesitaCultivo = f('recurrente') || f('nonalbicans') || f('falla_azoles') || f('sintomas_persist') || f('inmunosupresion') || f('diabetes') || diagType === 'clinico';
  const necesitaSensibilidad = f('nonalbicans') || f('falla_azoles') || f('sintomas_persist') || f('inmunosupresion');

  const indicacionesCultivo: string[] = [
    ...(diagType === 'clinico'  ? ['Diagnostico clinico sin confirmacion de laboratorio - microscopia o cultivo requerido'] : []),
    ...(f('recurrente')        ? ['RVVC (>=4 episodios/ano) - identificar especie y detectar cambio de sensibilidad'] : []),
    ...(f('nonalbicans')       ? ['Especie no-albicans - confirmar especie actual y verificar posibles cambios fenotipicos'] : []),
    ...(f('falla_azoles')      ? ['Falla a tratamiento azolico - obligatorio antes de cambiar esquema terapeutico'] : []),
    ...(f('sintomas_persist')  ? ['Sintomas persistentes >7-14 dias pese a tratamiento adecuado'] : []),
    ...(f('inmunosupresion')   ? ['Inmunosupresion - mayor riesgo de especie resistente o diseminacion sistemica'] : []),
    ...(f('diabetes')          ? ['Diabetes mal controlada - factor predisponente para recurrencia y resistencia adquirida'] : []),
  ];

  type SensItem = { icono: IoniconName; color: string; titulo: string; texto: string };
  const sensibilidades: SensItem[] = [
    ...(f('nonalbicans')  ? [{ icono: 'cellular-outline' as IoniconName, color: '#6D28D9', titulo: 'Especie no-albicans identificada', texto: 'C. glabrata: solicitar MIC para fluconazol, voriconazol, anidulafungina y caspofungina (CLSI/EUCAST). C. krusei: resistencia intrinseca a fluconazol. Otras especies: panel completo.' }] : []),
    ...(f('falla_azoles') ? [{ icono: 'warning-outline'  as IoniconName, color: Colors.danger,  titulo: 'Falla a azoles', texto: 'MIC para fluconazol segun CLSI M27-A3 o EUCAST E.DEF 7.3. Si MIC fluconazol >8 ug/mL (resistente) - cambiar a antifungico no-azol.' }] : []),
    ...(f('sintomas_persist') ? [{ icono: 'time-outline' as IoniconName, color: Colors.warning, titulo: 'Sintomas persistentes', texto: 'MIC fluconazol. Si se identifica especie no-albicans: panel extendido. Descartar reinfeccion y factores predisponentes no resueltos.' }] : []),
    ...(f('recurrente') && f('falla_azoles') ? [{ icono: 'refresh-outline' as IoniconName, color: Colors.danger, titulo: 'RVVC con recaida durante mantenimiento', texto: 'Panel extendido: fluconazol, voriconazol, posaconazol, equinocandinas (MFG/ANF/CSP). Verificar adherencia antes de asumir resistencia. Derivar a especialista.' }] : []),
    ...(f('inmunosupresion') ? [{ icono: 'shield-outline' as IoniconName, color: Colors.warning, titulo: 'Inmunosupresion', texto: 'Panel completo de sensibilidad (azoles + equinocandinas + polienos). Hemocultivos seriados si fiebre. Solicitar B-D-glucano serico. Derivar a infectologia.' }] : []),
  ];

  const seguimiento: Array<{ icono: IoniconName; text: string; c: string }> = [
    { icono: 'checkmark-circle-outline', text: 'Sintomas resueltos - Confirmar curacion. En RVVC: seguimiento al mes 1, 3 y 6.', c: Colors.success },
    { icono: 'refresh-outline',          text: 'Recurrencia tras mantenimiento - Cultivo, identificar especie, revisar adherencia y factores predisponentes.', c: Colors.warning },
    { icono: 'warning-outline',          text: 'Sin respuesta a azoles - Cultivo + MIC + cambio terapeutico. Referir si sospecha de no-albicans o resistencia.', c: Colors.danger },
    { icono: 'person-outline',           text: 'Derivar a ginecologia / infectologia: falla tras tratamiento completo, C. glabrata resistente o inmunosupresion.', c: '#6D28D9' },
  ];

  return (
    <View style={s.step}>
      <View style={[s.iconBox, { backgroundColor: necesitaCultivo ? '#FEF2F2' : '#F0FDF4' }]}>
        <Ionicons
          name={necesitaCultivo ? 'flask-outline' : 'checkmark-circle-outline'}
          size={30}
          color={necesitaCultivo ? Colors.danger : Colors.success}
        />
      </View>
      <Text style={s.title}>Cultivo y sensibilidad</Text>
      <Text style={s.sub}>
        {necesitaCultivo
          ? 'En esta paciente se recomienda cultivo vaginal con identificacion de especie.'
          : 'Para VVC no complicada sin factores de riesgo, el cultivo rutinario no esta indicado.'}
      </Text>

      {necesitaCultivo && (
        <View style={s.card}>
          <CardTitle icono="flask-outline" text="Indicaciones de cultivo" color={Colors.danger} />
          {indicacionesCultivo.map((txt, i) => <Bullet key={i} text={txt} />)}
          <Divider />
          <AlertBox icono="bulb-outline" bg={Colors.primaryLight} border={Colors.primary}>
            <Text style={[sh.alertTxt, { color: Colors.dark }]}>
              <Text style={{ fontWeight: '700' }}>Solicitar:</Text>{' '}Cultivo vaginal en agar Sabouraud o medio cromogenico (CHROMagar Candida). Identificacion de especie por morfologia, CHROMagar o MALDI-TOF si disponible.
            </Text>
          </AlertBox>
        </View>
      )}

      {necesitaSensibilidad && (
        <View style={s.card}>
          <CardTitle icono="analytics-outline" text="Pruebas de sensibilidad (MIC)" color="#6D28D9" />
          <Text style={s.micRef}>Metodo de referencia: <Text style={{ fontWeight: '700' }}>CLSI M27-A3</Text> / <Text style={{ fontWeight: '700' }}>EUCAST E.DEF 7.3</Text></Text>
          {sensibilidades.map((item, i) => (
            <View key={i} style={[s.micBlock, { borderLeftColor: item.color }]}>
              <View style={s.micTituloRow}>
                <Ionicons name={item.icono} size={13} color={item.color} />
                <Text style={[s.micTitulo, { color: item.color }]}>{item.titulo}</Text>
              </View>
              <Text style={s.micTxt}>{item.texto}</Text>
            </View>
          ))}
          <Divider />
          <AlertBox icono="analytics-outline" iconColor="#6D28D9" bg="#F5F3FF" border="#6D28D9">
            <Text style={[sh.alertTxt, { color: Colors.dark }]}>
              <Text style={{ fontWeight: '700' }}>Puntos de corte MIC C. albicans fluconazol (CLSI):{'\n'}</Text>
              S 2 ug/mL · I = 4 ug/mL · R 8 ug/mL{'\n'}Para no-albicans usar puntos de corte especificos por especie segun tabla CLSI/EUCAST vigente.
            </Text>
          </AlertBox>
        </View>
      )}

      {(f('recurrente') || f('diabetes') || f('antibioticos')) && (
        <View style={s.card}>
          <CardTitle icono="leaf-outline" text="Estrategias complementarias" color="#0F766E" />
          <Bullet text="Probioticos con Lactobacillus spp. - evidencia moderada para reduccion de recurrencias" color="#0F766E" />
          {f('diabetes')     && <Bullet text="Control glucemico: objetivo HbA1c <7% · Derivar a endocrinologia si mal controlada" color="#0F766E" />}
          {f('antibioticos') && <Bullet text="Limitar antibioticos de amplio espectro · Profilaxis antifungica si inevitable en RVVC" color="#0F766E" />}
          <Bullet text="Revisar anticonceptivos hormonales como posible factor predisponente" color="#0F766E" />
          <Bullet text="Considerar retiro de DIU en RVVC refractaria" color="#0F766E" />
        </View>
      )}

      <View style={s.card}>
        <CardTitle icono="calendar-outline" text="Seguimiento" />
        {seguimiento.map((item, i) => (
          <View key={i} style={[s.segRow, { borderLeftColor: item.c }]}>
            <Ionicons name={item.icono} size={16} color={item.c} style={{ marginTop: 1 }} />
            <Text style={s.segTxt}>{item.text}</Text>
          </View>
        ))}
      </View>

      <NavRow onBack={onBack} onNext={onReset} nextLabel="Nueva consulta" nextColor={Colors.success} />
      <GuiasBtn onPress={onVerFundamento} />
    </View>
  );
}