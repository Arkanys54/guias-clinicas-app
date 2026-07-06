import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/theme';
import { DiagType, FactorId, isComplicada } from '../../constants/vvcTypes';
import { AlertBox, Bullet, CardTitle, Divider, NavRow, TtoItem, sh } from './VvcShared';
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
  onNext: () => void;
  onBack: () => void;
  onVerFundamento: () => void;
}

export function PasoDecision({ factores, diagType, onNext, onBack, onVerFundamento }: Props) {
  const f = (id: FactorId) => factores.has(id);
  const complicada = isComplicada(factores);

  return (
    <View style={s.step}>
      {/* Badge clasificación */}
      <View style={[s.badge, { borderColor: complicada ? Colors.danger : Colors.success, backgroundColor: complicada ? '#FEF2F2' : '#F0FDF4' }]}>
        <Ionicons name={complicada ? 'alert-circle' : 'checkmark-circle'} size={32} color={complicada ? Colors.danger : Colors.success} />
        <View>
          <Text style={[s.badgeLabel, { color: complicada ? Colors.danger : Colors.success }]}>
            VVC {complicada ? 'COMPLICADA' : 'NO COMPLICADA'}
          </Text>
          <Text style={s.badgeSub}>
            {complicada ? 'Manejo especifico segun factores identificados' : 'Tratamiento estandar de primera linea'}
          </Text>
        </View>
      </View>

      {/* Tratamiento no complicada */}
      {!complicada && (
        <View style={s.card}>
          <CardTitle icono="medkit-outline" text="Tratamiento de primera linea" />
          <TtoItem num="A" color={Colors.primary} titulo="Fluconazol oral - sistemico" dosis="150 mg VO · dosis unica" nota="Repetir a las 72 h si sintomas persistentes · Evitar en 1er trimestre de embarazo" />
          <Divider />
          <TtoItem num="B" color="#0F766E" titulo="Clotrimazol vaginal - topico" dosis="500 mg ovulo · dosis unica" nota="O 200 mg x 3 dias · Eficacia comparable al fluconazol oral" />
          <Divider />
          <TtoItem num="C" color="#0F766E" titulo="Miconazol vaginal - topico" dosis="1200 mg ovulo · dosis unica" nota="O 200 mg x 3 dias · Puede debilitar preservativos de latex" />
          <Divider />
          <TtoItem num="D" color={Colors.darkGray} titulo="Econazol / Isoconazol / Fenticonazol" dosis="Esquemas de 1-3 dias" nota="Alternativas topicas con eficacia comparable" />
          <AlertBox icono="information-circle-outline" bg={Colors.primaryLight} border={Colors.primary}>
            <Text style={[sh.alertTxt, { color: Colors.dark }]}>Los azoles topicos pueden causar irritacion o ardor local (1-10%). Eficacia equivalente a fluconazol oral.</Text>
          </AlertBox>
        </View>
      )}

      {/* Embarazo */}
      {f('embarazo') && (
        <View style={s.card}>
          <CardTitle icono="heart-outline" text="Tratamiento en embarazo" color="#6D28D9" />
          <TtoItem num="1" color="#6D28D9" titulo="Clotrimazol vaginal · primera linea" dosis="500 mg ovulo · dosis unica" nota="Opcion preferida en cualquier trimestre" />
          <Divider />
          <TtoItem num="2" color="#6D28D9" titulo="Clotrimazol vaginal · pauta extendida" dosis="100 mg/dia x 7 dias" nota="Si se prefiere curso mas largo" />
          <AlertBox icono="ban-outline" iconColor={Colors.danger} bg="#FEF2F2" border={Colors.danger}>
            <Text style={[sh.alertTxt, { color: Colors.dark }]}>
              <Text style={{ fontWeight: '700' }}>Evitar fluconazol oral,</Text>{' '}especialmente en el primer trimestre (riesgo teratogenico). Usar unicamente azoles topicos durante todo el embarazo.
            </Text>
          </AlertBox>
        </View>
      )}

      {/* RVVC */}
      {f('recurrente') && (
        <View style={s.card}>
          <CardTitle icono="refresh-outline" text="RVVC - Induccion + Mantenimiento" color={Colors.danger} />
          <TtoItem num="1" color={Colors.danger} titulo="Fase de induccion (3 dosis)" dosis="Fluconazol 150 mg VO · dias 1, 4 y 7" nota="Asegurar cumplimiento de las 3 dosis · Controlar funcion hepatica" />
          <Divider />
          <TtoItem num="2" color={Colors.warning} titulo="Fase de mantenimiento · 6 meses" dosis="Fluconazol 150 mg VO · 1x/semana" nota="Iniciar tras completar induccion · Reduce recurrencia al ~10%" />
          <AlertBox icono="globe-outline" bg="#F5F3FF" border="#6D28D9">
            <Text style={[sh.alertTxt, { color: Colors.dark }]}>
              <Text style={{ fontWeight: '700' }}>Alternativa AWMF/IUSTI: </Text>Fluconazol 200 mg 3x/semana x 1 semana - semanal x 2 meses - mensual x 6 meses.
            </Text>
          </AlertBox>
          <AlertBox icono="warning-outline" bg="#FFFBEB" border={Colors.warning}>
            <Text style={[sh.alertTxt, { color: Colors.dark }]}>Vigilar hepatotoxicidad e interacciones CYP3A4. Evitar en embarazo.</Text>
          </AlertBox>
        </View>
      )}

      {/* Non-albicans */}
      {f('nonalbicans') && (
        <View style={s.card}>
          <CardTitle icono="cellular-outline" text="Candida no-albicans" color="#6D28D9" />
          <Text style={s.subSection}>C. glabrata / C. krusei / otras</Text>
          <TtoItem num="1" color="#6D28D9" titulo="Acido borico vaginal" dosis="600 mg intravaginal/noche x 14-21 dias" nota="Solo mujeres no embarazadas · Solo uso vaginal · Toxico si se ingiere" />
          <Divider />
          <TtoItem num="2" color={Colors.darkGray} titulo="Nistatina vaginal" dosis="100,000-200,000 UI/dia x 14 dias" nota="Si acido borico no disponible" />
          <Divider />
          <TtoItem num="3" color={Colors.darkGray} titulo="Ciclopirox olamina vaginal" dosis="Esquema de 14 dias" nota="Alternativa para C. glabrata · Buen perfil de seguridad" />
          <Divider />
          <TtoItem num="4" color={Colors.darkGray} titulo="5-Flucitosina vaginal (compounding)" dosis="Crema 17% intravaginal x 14 dias" nota="Preparacion magistral · Para casos refractarios" />
          <AlertBox icono="cellular-outline" iconColor="#6D28D9" bg="#F5F3FF" border="#6D28D9">
            <Text style={[sh.alertTxt, { color: Colors.dark }]}>
              <Text style={{ fontWeight: '700' }}>C. krusei</Text> es intrínsecamente resistente a fluconazol.{' '}
              <Text style={{ fontWeight: '700' }}>C. glabrata</Text> con frecuencia presenta sensibilidad reducida a azoles.
            </Text>
          </AlertBox>
          <AlertBox icono="flask-outline" iconColor={Colors.danger} bg="#FEF2F2" border={Colors.danger}>
            <Text style={[sh.alertTxt, { color: Colors.dark }]}>
              <Text style={{ fontWeight: '700' }}>Cultivo + identificacion de especie + MIC son OBLIGATORIOS</Text>{' '}antes de iniciar o cambiar el esquema terapeutico.
            </Text>
          </AlertBox>
        </View>
      )}

      {/* Falla azoles */}
      {(f('falla_azoles') || f('sintomas_persist')) && (
        <View style={s.card}>
          <CardTitle icono="warning-outline" text="Falla o resistencia a azoles" color={Colors.danger} />
          <TtoItem num="1" color={Colors.danger} titulo="Acido borico vaginal" dosis="600 mg intravaginal/noche x 14 dias" nota="Solo mujeres no embarazadas · Riesgo reproductivo si ingestion accidental" />
          <Divider />
          <TtoItem num="2" color={Colors.darkGray} titulo="5-Flucitosina vaginal (compounding)" dosis="Crema 17% intravaginal x 14 dias" nota="Si disponible - preparacion magistral" />
          <Divider />
          <TtoItem num="3" color={Colors.darkGray} titulo="Antisepticos vaginales coadyuvantes" dosis="Dequalinio / Octenidina" nota="Apoyo mientras se ajusta tratamiento" />
          <AlertBox icono="flask-outline" iconColor={Colors.danger} bg="#FEF2F2" border={Colors.danger}>
            <Text style={[sh.alertTxt, { color: Colors.dark }]}>
              <Text style={{ fontWeight: '700' }}>OBLIGATORIO antes de cambiar tratamiento:</Text>{' '}Cultivo vaginal + identificacion de especie + prueba de sensibilidad (MIC) segun CLSI/EUCAST.
            </Text>
          </AlertBox>
        </View>
      )}

      {/* Inmunosupresión */}
      {f('inmunosupresion') && (
        <View style={s.card}>
          <CardTitle icono="shield-outline" text="Paciente inmunosuprimida" color={Colors.warning} />
          <AlertBox icono="warning-outline" bg="#FFFBEB" border={Colors.warning}>
            <Text style={[sh.alertTxt, { color: Colors.dark }]}>La respuesta al tratamiento estandar puede ser insuficiente. Descartar candidemia y candidiasis sistemica.</Text>
          </AlertBox>
          <Bullet text="Hemograma, funcion hepatica y renal basal" color={Colors.warning} />
          <Bullet text="Hemocultivos si sospecha de fungemia o fiebre sin foco" color={Colors.warning} />
          <Bullet text="Derivar a infectologia si no hay respuesta en 72-96 h" color={Colors.warning} />
        </View>
      )}

      {/* Factores predisponentes */}
      {(f('diabetes') || f('antibioticos')) && (
        <View style={s.card}>
          <CardTitle icono="water-outline" text="Factores predisponentes" color={Colors.warning} />
          {f('diabetes') && <Bullet text="Control glucemico: objetivo HbA1c <7%. La hiperglucemia favorece la proliferacion de Candida spp." color={Colors.warning} />}
          {f('antibioticos') && <Bullet text="Limitar antibioticos de amplio espectro. Si inevitables en RVVC, considerar profilaxis antifungica concomitante." color={Colors.warning} />}
        </View>
      )}

      {/* Metodología diagnóstica */}
      <View style={s.card}>
        <CardTitle icono="search-outline" text="Metodologia diagnostica" />
        {diagType === 'microscopia' && (
          <View style={sh.diagResultRow}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
            <Text style={sh.bodyTxt}><Text style={{ fontWeight: '700' }}>Microscopia positiva confirmada.</Text> Identificacion de pseudohifas y blastosporas mediante KOH 10% o suero fisiologico.</Text>
          </View>
        )}
        {diagType === 'cultivo_pos' && (
          <View style={sh.diagResultRow}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
            <Text style={sh.bodyTxt}><Text style={{ fontWeight: '700' }}>Cultivo positivo.</Text> Agar Sabouraud o medio cromogenico. Permite identificacion de especie - esencial en casos complicados.</Text>
          </View>
        )}
        {diagType === 'clinico' && (
          <AlertBox icono="warning-outline" bg="#FFFBEB" border={Colors.warning}>
            <Text style={[sh.alertTxt, { color: Colors.dark }]}>
              <Text style={{ fontWeight: '700' }}>Sin confirmacion de laboratorio.</Text>{' '}Se recomienda solicitar microscopia con KOH para mayor precision.
            </Text>
          </AlertBox>
        )}
      </View>

      <NavRow onBack={onBack} onNext={onNext} nextLabel="Cultivo y sensibilidad" />
      <GuiasBtn onPress={onVerFundamento} />
    </View>
  );
}