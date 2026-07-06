import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BusquedaResultadoDto } from '../services/api.types';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../constants/theme';

interface ResultadoCardMejoradoProps {
  hallazgo: BusquedaResultadoDto;
}

export const ResultadoCardMejorado: React.FC<ResultadoCardMejoradoProps> = ({ hallazgo }) => {
  const [expandidoMap, setExpandidoMap] = useState<{ [key: number]: boolean }>({});

  const toggleExpand = (id: number) =>
    setExpandidoMap((prev) => ({ ...prev, [id]: !prev[id] }));

  const abrirEnlace = (url: string) => {
    if (url) Linking.openURL(url).catch((err) => console.error('Error al abrir:', err));
  };

  const formatearFecha = (fecha: string): string => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>

      {/* ── Header del hallazgo ── */}
      <View style={styles.hallazgoHeader}>
        <View style={styles.hallazgoIconWrap}>
          <Ionicons name="document-text-outline" size={22} color={Colors.primary} />
        </View>
        <View style={styles.hallazgoInfo}>
          <Text style={styles.hallazgoNombre} numberOfLines={2}>
            {hallazgo.hallazgoNombre}
          </Text>
          {!!hallazgo.hallazgoDescripcion && (
            <Text style={styles.hallazgoDesc} numberOfLines={3}>
              {hallazgo.hallazgoDescripcion}
            </Text>
          )}
        </View>
      </View>

      {/* ── Separador ── */}
      <View style={styles.divider} />

      {/* ── Recomendaciones ── */}
      <View style={styles.recHeader}>
        <View style={styles.recTituloWrap}>
          <Ionicons name="clipboard-outline" size={16} color={Colors.dark} />
          <Text style={styles.recTitulo}>Recomendaciones</Text>
        </View>
        <View style={styles.recBadge}>
          <Text style={styles.recBadgeText}>{hallazgo.recomendaciones?.length || 0}</Text>
        </View>
      </View>

      {hallazgo.recomendaciones && hallazgo.recomendaciones.length > 0 ? (
        <View style={styles.recList}>
          {hallazgo.recomendaciones.map((rec, index) => {
            const expandida = expandidoMap[rec.recomendacionId] || false;

            return (
              <View key={rec.recomendacionId || index} style={styles.recItem}>

                {/* Alta prioridad */}
                {rec.prioridad === 1 && (
                  <View style={styles.prioridadBadge}>
                    <Ionicons name="star" size={11} color={Colors.danger} />
                    <Text style={styles.prioridadText}>Alta prioridad</Text>
                  </View>
                )}

                {/* Título de recomendación */}
                <Text style={styles.recItemTitulo}>{rec.titulo}</Text>

                {/* Botón expandir */}
                <TouchableOpacity
                  style={styles.expandBtn}
                  onPress={() => toggleExpand(rec.recomendacionId)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={expandida ? 'chevron-up' : 'chevron-down'}
                    size={14}
                    color={Colors.primary}
                  />
                  <Text style={styles.expandBtnText}>
                    {expandida ? 'Menos detalles' : 'Ver detalles'}
                  </Text>
                </TouchableOpacity>

                {/* Contenido expandido */}
                {expandida && (
                  <View style={styles.expandedContent}>

                    {/* Descripción */}
                    <View style={styles.contentBlock}>
                      <View style={styles.contentBlockHeader}>
                        <Ionicons name="reader-outline" size={13} color={Colors.primary} />
                        <Text style={styles.contentBlockLabel}>Descripción</Text>
                      </View>
                      <Text style={styles.contentBlockText}>{rec.texto}</Text>
                    </View>

                    {/* Justificación */}
                    {!!rec.justificacion && (
                      <View style={styles.contentBlock}>
                        <View style={styles.contentBlockHeader}>
                          <Ionicons name="flask-outline" size={13} color={Colors.primary} />
                          <Text style={styles.contentBlockLabel}>Justificación clínica</Text>
                        </View>
                        <Text style={styles.contentBlockText}>{rec.justificacion}</Text>
                      </View>
                    )}

                    {/* Guía clínica */}
                    {!!rec.guiaClinica && !!rec.guiaClinica.enlaceDocumento && (
                      <View style={styles.guiaBlock}>
                        <View style={styles.guiaBlockHeader}>
                          <Ionicons name="book-outline" size={14} color={Colors.primary} />
                          <Text style={styles.guiaBlockLabel}>Guía clínica asociada</Text>
                        </View>

                        <Text style={styles.guiaTitulo}>{rec.guiaClinica.titulo}</Text>

                        <View style={styles.guiaMeta}>
                          <View style={styles.guiaMetaItem}>
                            <Text style={styles.guiaMetaLabel}>Nivel de evidencia</Text>
                            <View style={styles.guiaMetaBadge}>
                              <Text style={styles.guiaMetaValue}>{rec.guiaClinica.nivelEvidencia}</Text>
                            </View>
                          </View>
                          <View style={styles.guiaMetaItem}>
                            <Text style={styles.guiaMetaLabel}>Actualización</Text>
                            <Text style={styles.guiaMetaDate}>
                              {formatearFecha(rec.guiaClinica.fechaActualizacion)}
                            </Text>
                          </View>
                        </View>

                        <TouchableOpacity
                          style={styles.enlaceBtn}
                          onPress={() => abrirEnlace(rec.guiaClinica.enlaceDocumento)}
                          activeOpacity={0.8}
                        >
                          <Ionicons name="open-outline" size={15} color={Colors.white} />
                          <Text style={styles.enlaceBtnText}>Ver documento completo</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                  </View>
                )}
              </View>
            );
          })}
        </View>
      ) : (
        <View style={styles.sinRecomendaciones}>
          <Ionicons name="information-circle-outline" size={16} color={Colors.gray} />
          <Text style={styles.sinRecomendacionesText}>No hay recomendaciones disponibles</Text>
        </View>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.large,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.medium,
  },

  // Header hallazgo
  hallazgoHeader: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'flex-start',
  },
  hallazgoIconWrap: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.rounded,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  hallazgoInfo: { flex: 1 },
  hallazgoNombre: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark,
    lineHeight: 22,
  },
  hallazgoDesc: {
    ...Typography.bodySmall,
    color: Colors.gray,
    marginTop: Spacing.xs,
    lineHeight: 18,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.lg,
  },

  // Header recomendaciones
  recHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  recTituloWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  recTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.dark,
  },
  recBadge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: Spacing.sm,
  },
  recBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },

  recList: { gap: Spacing.md },

  // Item recomendación
  recItem: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  prioridadBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#FEF2F2',
    borderRadius: BorderRadius.small,
    paddingVertical: 3,
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  prioridadText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.danger,
  },
  recItemTitulo: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.dark,
    lineHeight: 18,
  },
  expandBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.sm,
    alignSelf: 'flex-start',
  },
  expandBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },

  // Contenido expandido
  expandedContent: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.md,
  },
  contentBlock: { gap: Spacing.xs },
  contentBlockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  contentBlockLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contentBlockText: {
    ...Typography.bodySmall,
    color: Colors.dark,
    lineHeight: 20,
  },

  // Guía clínica
  guiaBlock: {
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    gap: Spacing.sm,
  },
  guiaBlockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  guiaBlockLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  guiaTitulo: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.dark,
    lineHeight: 18,
  },
  guiaMeta: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  guiaMetaItem: { gap: 3 },
  guiaMetaLabel: {
    fontSize: 10,
    color: Colors.gray,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  guiaMetaBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  guiaMetaValue: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
  },
  guiaMetaDate: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  enlaceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.medium,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xs,
  },
  enlaceBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
  },

  // Sin recomendaciones
  sinRecomendaciones: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  sinRecomendacionesText: {
    ...Typography.bodySmall,
    color: Colors.gray,
    fontStyle: 'italic',
  },
});