import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '../Appheader';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../constants/theme';
import { SugerenciasDropdown } from '../../hooks/SugerenciasDropdown';
import { ResultadoCardMejorado } from '../ResultadoCard';
import { Button, Card, EmptyState, Section, SkeletonLoader } from '../Ui';
import { getBottomViewportInset } from '../../utils/layout';
import { useBuscadorMejora } from '../Usebuscadormejora';

type TipoBusqueda = 'unico' | 'multiple';

const TIPO_OPTIONS: { key: TipoBusqueda; label: string; icono: keyof typeof Ionicons.glyphMap; desc: string }[] = [
  { key: 'unico',    label: 'Mejor resultado', icono: 'ribbon-outline',  desc: 'El más relevante' },
  { key: 'multiple', label: 'Múltiples',        icono: 'list-outline',    desc: 'Hasta 20 resultados' },
];

export default function BusquedaScreenMejorada() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomInset = getBottomViewportInset(insets.bottom);

  // Animación de entrada
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const {
    terminoBusqueda,
    sugerencias,
    resultados,
    resultadoUnico,
    cargandoSugerencias,
    cargandoResultados,
    error,
    mostrarSugerencias,
    handleCambioTermino,
    buscarUnico,
    buscarMultiples,
    seleccionarSugerencia,
    limpiarBusqueda,
    setMostrarSugerencias,
  } = useBuscadorMejora({ delayMs: 300, limiteSugerencias: 10 });

  const [tipoBusqueda, setTipoBusqueda] = useState<TipoBusqueda>('unico');
  const [limite, setLimite] = useState('5');
  const [hayBusqueda, setHayBusqueda] = useState(false);

  const handleBuscar = async () => {
    if (!terminoBusqueda.trim()) {
      Alert.alert('Término requerido', 'Por favor ingresa un término de búsqueda.');
      return;
    }
    setHayBusqueda(true);
    if (tipoBusqueda === 'unico') {
      await buscarUnico(terminoBusqueda);
    } else {
      await buscarMultiples(terminoBusqueda, parseInt(limite) || 5);
    }
  };

  const handleLimpiar = () => {
    setHayBusqueda(false);
    limpiarBusqueda();
  };

  const ejemplosBusqueda: { label: string; icono: keyof typeof Ionicons.glyphMap }[] = [
    { label: 'CVV Severa',   icono: 'alert-circle-outline' },
    { label: 'Resistencia',  icono: 'shield-outline' },
    { label: 'Non-albicans', icono: 'flask-outline' },
    { label: 'Fluconazol',   icono: 'medkit-outline' },
    { label: 'Recurrente',   icono: 'refresh-outline' },
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AppHeader
        titulo="Búsqueda inteligente"
        icono="search-outline"
        mostrarPerfil={false}
        accionIzquierda={{ icono: 'arrow-back', onPress: () => router.push('/(tabs)/guias') }}
      />

      <Animated.View style={[{ flex: 1 }, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <ScrollView
        style={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: bottomInset }}
      >
        <View style={styles.content}>

          {/* ── Tipo de búsqueda ── */}
          <View style={styles.tipoWrap}>
            {TIPO_OPTIONS.map((op) => {
              const activo = tipoBusqueda === op.key;
              return (
                <TouchableOpacity
                  key={op.key}
                  style={[styles.tipoBtn, activo && styles.tipoBtnActive]}
                  onPress={() => setTipoBusqueda(op.key)}
                  activeOpacity={0.75}
                >
                  <Ionicons
                    name={op.icono}
                    size={18}
                    color={activo ? Colors.white : Colors.gray}
                  />
                  <View>
                    <Text style={[styles.tipoBtnLabel, activo && styles.tipoBtnLabelActive]}>
                      {op.label}
                    </Text>
                    <Text style={[styles.tipoBtnDesc, activo && styles.tipoBtnDescActive]}>
                      {op.desc}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ── Input ── */}
          <Section title="Buscar hallazgos">
            <View style={[styles.searchInputWrapper, cargandoResultados && styles.searchInputDisabled]}>
              <Ionicons name="search-outline" size={20} color={Colors.primary} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="CVV severa, diabetes, candidosis..."
                placeholderTextColor={Colors.gray}
                value={terminoBusqueda}
                onChangeText={handleCambioTermino}
                onFocus={() => !!terminoBusqueda && setMostrarSugerencias(true)}
                onSubmitEditing={handleBuscar}
                editable={!cargandoResultados}
              />
              {!!terminoBusqueda && (
                <TouchableOpacity style={styles.clearButton} onPress={limpiarBusqueda} activeOpacity={0.6}>
                  <Ionicons name="close-circle" size={18} color={Colors.gray} />
                </TouchableOpacity>
              )}
            </View>

            {mostrarSugerencias && (
              <SugerenciasDropdown
                sugerencias={sugerencias}
                cargando={cargandoSugerencias}
                visible={mostrarSugerencias}
                onSelectSugerencia={seleccionarSugerencia}
                onClose={() => setMostrarSugerencias(false)}
                termino={terminoBusqueda}
              />
            )}

            {tipoBusqueda === 'multiple' && (
              <View style={styles.limiteContainer}>
                <Text style={[Typography.bodySmall, { color: Colors.darkGray, fontWeight: '600' }]}>
                  Máximo de resultados
                </Text>
                <View style={styles.limiteRow}>
                  {['3', '5', '10', '20'].map((num) => (
                    <TouchableOpacity
                      key={num}
                      style={[styles.limiteBtn, limite === num && styles.limiteBtnActive]}
                      onPress={() => setLimite(num)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.limiteBtnText, limite === num && styles.limiteBtnTextActive]}>
                        {num}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.actionButtons}>
              <Button
                label={cargandoResultados ? 'Buscando...' : 'Buscar'}
                onPress={handleBuscar}
                variant="primary"
                size="large"
                loading={cargandoResultados}
                fullWidth
              />
              {!!terminoBusqueda && (
                <Button
                  label="Limpiar"
                  onPress={handleLimpiar}
                  variant="ghost"
                  size="large"
                  fullWidth
                />
              )}
            </View>
          </Section>

          {/* ── Error ── */}
          {!!error && (
            <View style={styles.errorCard}>
              <Ionicons name="warning-outline" size={18} color={Colors.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* ── Loading ── */}
          {cargandoResultados && (
            <Section title="Buscando...">
              <SkeletonLoader />
              <SkeletonLoader />
            </Section>
          )}

          {/* ── Resultado único ── */}
          {!cargandoResultados && !!resultadoUnico && (
            <Section title="Resultado" subtitle="El más relevante para tu búsqueda">
              <ResultadoCardMejorado hallazgo={resultadoUnico} />
            </Section>
          )}

          {/* ── Resultados múltiples ── */}
          {!cargandoResultados && resultados.length > 0 && (
            <Section
              title="Resultados encontrados"
              subtitle={`${resultados.length} hallazgo${resultados.length !== 1 ? 's' : ''}`}
            >
              {resultados.map((hallazgo) => (
                <ResultadoCardMejorado key={hallazgo.hallazgoId} hallazgo={hallazgo} />
              ))}
            </Section>
          )}

          {/* ── Sin resultados ── */}
          {!cargandoResultados && !resultadoUnico && resultados.length === 0 && hayBusqueda && (
            <EmptyState
              icon="🔍"
              title="Sin resultados"
              description={`No hay hallazgos que coincidan con "${terminoBusqueda}". Intenta con otros términos.`}
              action={{ label: 'Nueva búsqueda', onPress: handleLimpiar }}
            />
          )}

          {/* ── Estado inicial ── */}
          {!cargandoResultados && !resultadoUnico && resultados.length === 0 && !hayBusqueda && (
            <Section title="Ejemplos de búsqueda">
              <View style={styles.ejemplosGrid}>
                {ejemplosBusqueda.map((ej) => (
                  <TouchableOpacity
                    key={ej.label}
                    style={styles.ejemploBtn}
                    onPress={() => handleCambioTermino(ej.label)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name={ej.icono} size={15} color={Colors.primary} />
                    <Text style={styles.ejemploBtnText}>{ej.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Card style={styles.tipCard}>
                <View style={styles.tipRow}>
                  <Ionicons name="bulb-outline" size={18} color={Colors.primary} />
                  <Text style={styles.tipText}>
                    <Text style={{ fontWeight: '700' }}>Búsqueda inteligente:</Text> reconoce errores tipográficos, sinónimos y términos relacionados.
                  </Text>
                </View>
              </Card>
            </Section>
          )}

        </View>
      </ScrollView>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollView: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    gap: Spacing.xl,
  },

  // Tipo de búsqueda
  tipoWrap: {
    flexDirection: 'row',
    gap: 4,
    backgroundColor: Colors.light,
    borderRadius: BorderRadius.rounded,
    padding: 4,
  },
  tipoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.large,
    backgroundColor: 'transparent',
  },
  tipoBtnActive: {
    backgroundColor: Colors.primary,
    ...Shadows.small,
  },
  tipoBtnLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.dark,
  },
  tipoBtnLabelActive: { color: Colors.white },
  tipoBtnDesc: {
    fontSize: 11,
    color: Colors.gray,
    marginTop: 1,
  },
  tipoBtnDescActive: { color: 'rgba(255,255,255,0.75)' },

  // Input
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.rounded,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    ...Shadows.small,
  },
  searchInputDisabled: { opacity: 0.6 },
  searchIcon: { marginRight: Spacing.sm },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.lg,
    fontSize: 15,
    color: Colors.dark,
  },
  clearButton: { padding: Spacing.sm },

  // Límite
  limiteContainer: { gap: Spacing.sm },
  limiteRow: { flexDirection: 'row', gap: Spacing.sm },
  limiteBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.large,
    backgroundColor: Colors.light,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  limiteBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  limiteBtnText: { fontSize: 13, fontWeight: '600', color: Colors.gray },
  limiteBtnTextActive: { color: Colors.white },

  actionButtons: { gap: Spacing.sm },

  // Error
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: '#FEF2F2',
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.danger,
  },
  errorText: { ...Typography.bodySmall, color: Colors.danger, flex: 1 },

  // Ejemplos
  ejemplosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  ejemploBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.rounded,
    borderWidth: 1,
    borderColor: `${Colors.primary}30`,
  },
  ejemploBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },

  // Tip card
  tipCard: {
    backgroundColor: Colors.primaryLight,
    marginBottom: 0,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  tipText: {
    flex: 1,
    ...Typography.bodySmall,
    color: Colors.primary,
    lineHeight: 18,
  },
});
