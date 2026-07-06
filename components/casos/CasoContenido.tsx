import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { DIFICULTAD_STYLE } from '../../constants/casosDificultad';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../constants/theme';
import { CasoClinicoUsuarioDto, RespuestaResultadoDto } from '../../services/api.types';
import { OpcionSelectable } from './OpcionSelectable';
import { ResultadoPanel } from './ResultadoPanel';

interface Props {
  scrollRef: React.RefObject<ScrollView | null>;
  bottomInset: number;
  caso: CasoClinicoUsuarioDto;
  estado: 'listo' | 'enviando' | 'resultado';
  opcionId: number | null;
  resultado: RespuestaResultadoDto | null;
  reintentando: boolean;
  onSelectOpcion: (id: number) => void;
  onEnviar: () => void;
  onVolver: () => void;
}

export function CasoContenido({
  scrollRef,
  bottomInset,
  caso,
  estado,
  opcionId,
  resultado,
  reintentando,
  onSelectOpcion,
  onEnviar,
  onVolver,
}: Props) {
  const difStyle = caso.dificultad ? DIFICULTAD_STYLE[caso.dificultad] : null;
  const enviando  = estado === 'enviando';
  const mostrandoResultado = estado === 'resultado' && !!resultado;

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.scroll}
      contentContainerStyle={[styles.content, { paddingBottom: bottomInset }]}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Badges ─────────────────────────────────────────────────────────── */}
      <View style={styles.badgeRow}>
        <View style={styles.badgeCategoria}>
          <Ionicons name="flask-outline" size={11} color={Colors.primary} />
          <Text style={styles.badgeCategoriaText}>{caso.categoriaNombre}</Text>
        </View>
        {caso.dificultad && difStyle && (
          <View style={[
            styles.badgeDif,
            { backgroundColor: difStyle.bg, borderColor: difStyle.border },
          ]}>
            <Text style={[styles.badgeDifText, { color: difStyle.text }]}>
              {caso.dificultad}
            </Text>
          </View>
        )}
      </View>

      {/* ── Título ─────────────────────────────────────────────────────────── */}
      <Text style={styles.titulo}>{caso.titulo}</Text>

      {/* ── Enfoque ────────────────────────────────────────────────────────── */}
      {!!caso.enfoque && (
        <View style={styles.enfoqueWrap}>
          <Ionicons name="bookmark-outline" size={14} color={Colors.primary} />
          <Text style={styles.enfoqueText}>Enfoque: {caso.enfoque}</Text>
        </View>
      )}

      {/* ── Imagen ─────────────────────────────────────────────────────────── */}
      {!!caso.imagenBase64 && (
        <Image
          source={{ uri: caso.imagenBase64 }}
          style={styles.imagen}
          resizeMode="cover"
        />
      )}

      {/* ── Premisa ────────────────────────────────────────────────────────── */}
      <View style={styles.premisaCard}>
        <Text style={styles.sectionLabel}>Caso clínico</Text>
        <Text style={styles.premisaText}>{caso.premisa}</Text>
      </View>

      {/* ── Pregunta ───────────────────────────────────────────────────────── */}
      <View style={styles.preguntaCard}>
        <Ionicons name="help-circle" size={18} color={Colors.primary} />
        <Text style={styles.preguntaText}>{caso.pregunta}</Text>
      </View>

      {/* ── Opciones ───────────────────────────────────────────────────────── */}
      {!mostrandoResultado && (
        <>
          <Text style={styles.sectionLabel}>
            {reintentando ? 'Selecciona una nueva respuesta' : 'Selecciona una opción'}
          </Text>
          <View style={styles.opciones}>
            {caso.opciones.map((op) => (
              <OpcionSelectable
                key={op.id}
                opcion={op}
                seleccionada={opcionId === op.id}
                deshabilitada={enviando}
                onSelect={() => onSelectOpcion(op.id)}
              />
            ))}
          </View>
        </>
      )}

      {/* ── Botón enviar ───────────────────────────────────────────────────── */}
      {!mostrandoResultado && (
        <TouchableOpacity
          style={[styles.submitBtn, (!opcionId || enviando) && styles.submitBtnDisabled]}
          onPress={onEnviar}
          disabled={!opcionId || enviando}
          activeOpacity={0.85}
        >
          {enviando ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <>
              <Ionicons
                name={reintentando ? 'refresh' : 'send'}
                size={18}
                color={Colors.white}
              />
              <Text style={styles.submitText}>
                {reintentando ? 'Actualizar respuesta' : 'Confirmar respuesta'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      )}

      {/* ── Panel de resultado ─────────────────────────────────────────────── */}
      {mostrandoResultado && (
        <ResultadoPanel
          resultado={resultado!}
          esReintento={reintentando}
          onVolver={onVolver}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: Spacing.lg, gap: Spacing.md },

  // Badges
  badgeRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  badgeCategoria: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.small,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  badgeCategoriaText: { fontSize: 12, fontWeight: '600', color: Colors.primary },
  badgeDif: {
    borderRadius: BorderRadius.small,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
  },
  badgeDifText: { fontSize: 12, fontWeight: '600' },

  // Encabezado del caso
  titulo: { fontSize: 19, fontWeight: '700', color: Colors.dark, lineHeight: 26 },
  enfoqueWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.small,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  enfoqueText: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  imagen: { width: '100%', height: 200, borderRadius: BorderRadius.large },

  // Tarjetas de texto
  premisaCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.large,
    padding: Spacing.lg,
    gap: Spacing.sm,
    ...Shadows.small,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  premisaText: { ...Typography.body, color: Colors.darkGray, lineHeight: 22, textAlign: 'justify' },
  preguntaCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.large,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  preguntaText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primaryDark,
    lineHeight: 22,
  },

  // Etiqueta de sección
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: Spacing.xs,
  },

  // Opciones
  opciones: { gap: Spacing.sm },

  // Botón enviar
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.medium,
    paddingVertical: 14,
    marginTop: Spacing.sm,
    ...Shadows.medium,
  },
  submitBtnDisabled: { backgroundColor: Colors.gray, opacity: 0.6 },
  submitText: { fontSize: 16, fontWeight: '700', color: Colors.white },
});
