import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '../components/Appheader';
import { obtenerCasosClinicos } from '../services/api';
import { CasoClinicoResumenDto } from '../services/api.types';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../constants/theme';
import { getBottomViewportInset } from '../utils/layout';

const DIFICULTADES = ['Todos', 'Básico', 'Intermedio', 'Avanzado'] as const;
type Dificultad = (typeof DIFICULTADES)[number];

const DIFICULTAD_STYLE: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  Básico:     { bg: Colors.primaryLight,  text: Colors.primary,  border: '#BFDBFE', dot: Colors.primary  },
  Intermedio: { bg: '#EDE9FE',            text: '#5B21B6',       border: '#C4B5FD', dot: '#7C3AED'       },
  Avanzado:   { bg: '#E0F2FE',            text: '#0369A1',       border: '#7DD3FC', dot: '#0284C7'       },
};

export default function CasosListaScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomInset = getBottomViewportInset(insets.bottom);
  const { categoriaId, categoriaNombre } = useLocalSearchParams<{
    categoriaId: string;
    categoriaNombre: string;
  }>();

  const [casos, setCasos] = useState<CasoClinicoResumenDto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dificultad, setDificultad] = useState<Dificultad>('Todos');

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    const res = await obtenerCasosClinicos({
      categoriaId: categoriaId ? Number(categoriaId) : undefined,
    });
    if (res.success && res.data) {
      setCasos(res.data);
    } else {
      setError(res.error ?? 'Error al cargar los casos.');
    }
    setCargando(false);
  }, [categoriaId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const casosFiltrados =
    dificultad === 'Todos' ? casos : casos.filter((c) => c.dificultad === dificultad);

  const irACaso = (caso: CasoClinicoResumenDto) => {
    router.push({
      pathname: './caso-detalle',
      params: { id: String(caso.id), titulo: caso.titulo },
    });
  };

  const conteo = (d: Dificultad) =>
    d === 'Todos' ? casos.length : casos.filter((c) => c.dificultad === d).length;

  return (
    <View style={styles.container}>
      <AppHeader
        titulo={categoriaNombre ?? 'Casos Clínicos'}
        icono="document-text-outline"
        accionIzquierda={{ icono: 'arrow-back', onPress: () => router.back() }}
        mostrarPerfil={false}
      />

      {/* ── Barra de filtros ─────────────────────────────────────────────── */}
      <View style={styles.filtroWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtroPills}
        >
          {DIFICULTADES.map((d) => {
            const activa = dificultad === d;
            const difSt = d !== 'Todos' ? DIFICULTAD_STYLE[d] : null;
            const n = conteo(d);
            return (
              <TouchableOpacity
                key={d}
                style={[
                  styles.pill,
                  activa
                    ? styles.pillActiva
                    : difSt
                    ? { borderColor: difSt.border, backgroundColor: difSt.bg }
                    : styles.pillInactiva,
                ]}
                onPress={() => setDificultad(d)}
                activeOpacity={0.75}
              >
                {/* Dot indicador de color para las opciones con dificultad */}
                {!activa && difSt && (
                  <View style={[styles.pillDot, { backgroundColor: difSt.dot }]} />
                )}
                {activa && (
                  <Ionicons name="checkmark-circle" size={13} color={Colors.white} />
                )}
                <Text
                  style={[
                    styles.pillText,
                    activa
                      ? styles.pillTextActiva
                      : difSt
                      ? { color: difSt.text }
                      : { color: Colors.darkGray },
                  ]}
                >
                  {d}
                </Text>
                {n > 0 && (
                  <View
                    style={[
                      styles.pillBadge,
                      activa
                        ? styles.pillBadgeActiva
                        : { backgroundColor: 'rgba(0,0,0,0.08)' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.pillBadgeText,
                        activa
                          ? { color: Colors.white }
                          : { color: difSt?.text ?? Colors.darkGray },
                      ]}
                    >
                      {n}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Contenido ────────────────────────────────────────────────────── */}
      {cargando ? (
        <View style={styles.centered}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
          <Text style={styles.loadingText}>Cargando casos…</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <View style={[styles.stateIconBox, { backgroundColor: '#FEF2F2' }]}>
            <Ionicons name="cloud-offline-outline" size={32} color={Colors.danger} />
          </View>
          <Text style={styles.errorTitle}>Algo salió mal</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={cargar} activeOpacity={0.8}>
            <Ionicons name="refresh-outline" size={15} color={Colors.white} />
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : casosFiltrados.length === 0 ? (
        <View style={styles.centered}>
          <View style={[styles.stateIconBox, { backgroundColor: Colors.primaryLight }]}>
            <Ionicons name="document-outline" size={32} color={Colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>Sin casos disponibles</Text>
          <Text style={styles.emptyText}>
            {dificultad === 'Todos'
              ? 'No hay casos disponibles en esta categoría.'
              : `No hay casos de dificultad "${dificultad}" en esta categoría.`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={casosFiltrados}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={[styles.lista, { paddingBottom: bottomInset }]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.resultadosRow}>
              <View style={styles.resultadosPill}>
                <Text style={styles.resultadosLabel}>
                  {casosFiltrados.length}{' '}
                  {casosFiltrados.length === 1 ? 'caso' : 'casos'}
                </Text>
              </View>
              {dificultad !== 'Todos' && (
                <TouchableOpacity
                  style={styles.limpiarFiltro}
                  onPress={() => setDificultad('Todos')}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close-circle" size={13} color={Colors.gray} />
                  <Text style={styles.limpiarFiltroText}>Limpiar filtro</Text>
                </TouchableOpacity>
              )}
            </View>
          }
          renderItem={({ item }) => (
            <CasoCard caso={item} onPress={() => irACaso(item)} />
          )}
          ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
        />
      )}
    </View>
  );
}

// ── Tarjeta de caso ───────────────────────────────────────────────────────────

function CasoCard({
  caso,
  onPress,
}: {
  caso: CasoClinicoResumenDto;
  onPress: () => void;
}) {
  const dif = caso.dificultad;
  const difStyle = dif ? DIFICULTAD_STYLE[dif] : null;

  return (
    <TouchableOpacity
      style={styles.casoCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Acento lateral de color por dificultad */}
      <View
        style={[
          styles.casoAccentBar,
          { backgroundColor: difStyle?.dot ?? Colors.primary },
        ]}
      />

      <View style={styles.casoInner}>
        {/* Fila superior: enfoque + badge dificultad */}
        <View style={styles.casoTop}>
          {caso.enfoque ? (
            <View style={styles.enfoqueWrap}>
              <Ionicons name="bookmark" size={11} color={Colors.primary} />
              <Text style={styles.casoEnfoque} numberOfLines={1}>
                {caso.enfoque}
              </Text>
            </View>
          ) : (
            <View />
          )}
          {dif && difStyle && (
            <View style={[styles.badge, { backgroundColor: difStyle.bg, borderColor: difStyle.border }]}>
              <View style={[styles.badgeDot, { backgroundColor: difStyle.dot }]} />
              <Text style={[styles.badgeText, { color: difStyle.text }]}>{dif}</Text>
            </View>
          )}
        </View>

        {/* Título */}
        <Text style={styles.casoTitulo} numberOfLines={2}>
          {caso.titulo}
        </Text>

        {/* CTA */}
        <View style={styles.casoBottom}>
          <View style={styles.casoCtaBtn}>
            <Text style={styles.casoAccionText}>Resolver caso</Text>
            <Ionicons name="arrow-forward-circle" size={16} color={Colors.primary} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ── Estilos ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // ── Filtro ─────────────────────────────────────────────────────────────────
  filtroWrap: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filtroPills: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    gap: Spacing.sm,
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: BorderRadius.rounded,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  pillInactiva: {
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  pillActiva: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.gray,
  },
  pillTextActiva: { color: Colors.white },
  pillBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  pillBadgeActiva: { backgroundColor: 'rgba(255,255,255,0.25)' },
  pillBadgeText: { fontSize: 11, fontWeight: '700' },

  // ── Estados ────────────────────────────────────────────────────────────────
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    padding: Spacing.xxxl,
  },
  stateIconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  loadingBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  loadingText: { ...Typography.bodySmall, color: Colors.gray },
  errorTitle: { ...Typography.body, color: Colors.dark, fontWeight: '700', textAlign: 'center' },
  errorText: { ...Typography.bodySmall, color: Colors.gray, textAlign: 'center', lineHeight: 20 },
  emptyTitle: { ...Typography.body, color: Colors.dark, fontWeight: '700', textAlign: 'center' },
  emptyText: { ...Typography.bodySmall, color: Colors.gray, textAlign: 'center', lineHeight: 20 },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm + 2,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.medium,
    marginTop: Spacing.xs,
  },
  retryText: { color: Colors.white, fontWeight: '700', fontSize: 14 },

  // ── Lista ──────────────────────────────────────────────────────────────────
  lista: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  resultadosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  resultadosPill: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: BorderRadius.rounded,
  },
  resultadosLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.4,
  },
  limpiarFiltro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  limpiarFiltroText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.gray,
  },

  // ── Tarjeta de caso ─────────────────────────────────────────────────────────
  casoCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.large,
    flexDirection: 'row',
    overflow: 'hidden',
    ...Shadows.medium,
  },
  casoAccentBar: {
    width: 4,
    borderTopLeftRadius: BorderRadius.large,
    borderBottomLeftRadius: BorderRadius.large,
  },
  casoInner: {
    flex: 1,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  casoTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  enfoqueWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  casoEnfoque: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    flex: 1,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.rounded,
    borderWidth: 1,
  },
  badgeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  badgeText: { fontSize: 11, fontWeight: '700' },
  casoTitulo: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.dark,
    lineHeight: 22,
  },
  casoBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: Spacing.xs,
  },
  casoCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.rounded,
  },
  casoAccionText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
});
