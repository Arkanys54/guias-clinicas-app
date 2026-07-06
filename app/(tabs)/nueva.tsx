import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '../../components/Appheader';
import { ModalGuias }      from '../../components/vvc/ModalGuias';
import { PantallaNoVVC }   from '../../components/vvc/PantallaNoVVC';
import { PasoCultivo }     from '../../components/vvc/PasoCultivo';
import { PasoDecision }    from '../../components/vvc/PasoDecision';
import { PasoDiagnostico } from '../../components/vvc/PasoDiagnostico';
import { PasoFactores }    from '../../components/vvc/PasoFactores';
import { PasoTriage }      from '../../components/vvc/PasoTriage';
import { ProgressBar }     from '../../components/vvc/VvcShared';
import { BorderRadius, Colors, Spacing } from '../../constants/theme';
import { useVvcDecision } from '../../hooks/useVvcDecision';
// Después
import { useRef, useCallback } from 'react';
// ...


export default function VVCDecision() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    scrollRef,
    paso, noVVC, setNoVVC,
    diagType, setDiagType,
    factores, showGuias, setShowGuias,
    irA, reiniciar, toggleFactor,
  } = useVvcDecision();

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useFocusEffect(
    useCallback(() => {
      fadeAnim.setValue(0);
      slideAnim.setValue(24);
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    }, [])
  );

  return (
    <>
      <StatusBar style="light" />
      <View style={gl.container}>
        <AppHeader
          titulo="Modo Decision"
          icono="git-branch-outline"
          mostrarPerfil={false}
          accionIzquierda={{ icono: 'arrow-back', onPress: () => router.push('/(tabs)/guias') }}
          accionDerecha={
            (paso !== 'triage' || noVVC) ? (
              <TouchableOpacity style={gl.resetBtn} onPress={reiniciar} activeOpacity={0.7}>
                <Ionicons name="refresh-outline" size={14} color={Colors.white} />
                <Text style={gl.resetTxt}>Reiniciar</Text>
              </TouchableOpacity>
            ) : undefined
          }
        />

        {!noVVC && paso !== 'triage' && <ProgressBar paso={paso} />}

        <Animated.View style={[{ flex: 1 }, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {/* Un único ScrollView con ref — scrollToTop en cada cambio de paso */}
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 40 + insets.bottom }}
          showsVerticalScrollIndicator={false}
        >
          {noVVC && <PantallaNoVVC onReset={reiniciar} />}

          {!noVVC && paso === 'triage' && (
            <PasoTriage
              onResp={(r) => {
                if (r === 'no') setNoVVC(true);
                else irA('diagnostico');
              }}
            />
          )}

          {!noVVC && paso === 'diagnostico' && (
            <PasoDiagnostico
              diag={diagType}
              setDiag={setDiagType}
              onNext={() => irA('factores')}
              onBack={() => irA('triage')}
            />
          )}

          {!noVVC && paso === 'factores' && (
            <PasoFactores
              sel={factores}
              onToggle={toggleFactor}
              onNext={() => irA('decision')}
              onBack={() => irA('diagnostico')}
            />
          )}

          {!noVVC && paso === 'decision' && (
            <PasoDecision
              factores={factores}
              diagType={diagType}
              onNext={() => irA('cultivo')}
              onBack={() => irA('factores')}
              onVerFundamento={() => setShowGuias(true)}
            />
          )}

          {!noVVC && paso === 'cultivo' && (
            <PasoCultivo
              factores={factores}
              diagType={diagType}
              onReset={reiniciar}
              onBack={() => irA('decision')}
              onVerFundamento={() => setShowGuias(true)}
            />
          )}
        </ScrollView>
        </Animated.View>
      </View>

      <ModalGuias visible={showGuias} onClose={() => setShowGuias(false)} />
    </>
  );
}

const gl = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  resetBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.medium,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  resetTxt: { fontSize: 11, color: Colors.white, fontWeight: '600' },
});