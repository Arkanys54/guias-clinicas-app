import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '../../Appheader';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../../constants/theme';
import { useAlgoritmoRunner } from '../../../hooks/useAlgoritmoRunner';
import { AlgoritmosEmptyState } from '../AlgoritmosEmptyState';
import { AlgorithmNodeRenderer } from './AlgorithmNodeRenderer';
import { AlgoritmoHeaderCard } from './AlgoritmoHeaderCard';
import { AlgoritmoRuntimeStateCard } from './AlgoritmoRuntimeStateCard';
import { getBottomViewportInset } from '../../../utils/layout';

interface Props {
  algoritmoId: number | null;
}

export function AlgoritmoRunnerScreen({ algoritmoId }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomInset = getBottomViewportInset(insets.bottom);
  const {
    cargando,
    currentNode,
    definition,
    error,
    context,
    responses,
    canGoBack,
    enviarRespuesta,
    recargar,
    reiniciar,
    retroceder,
  } = useAlgoritmoRunner(algoritmoId);

  const handleNodeSubmit = useCallback(
    (answer?: unknown) => {
      if (
        currentNode &&
        (currentNode.esTerminal ||
          ('accion' in currentNode && currentNode.accion?.accion === 'finish'))
      ) {
        router.replace('/algoritmos');
        return;
      }

      enviarRespuesta(answer);
    },
    [currentNode, enviarRespuesta, router]
  );

  const step = useMemo(() => {
    if (!definition || !currentNode) return 0;
    const index = definition.nodos.findIndex((node) => node.clave === currentNode.clave);
    return index >= 0 ? index + 1 : 0;
  }, [currentNode, definition]);

  return (
    <View style={styles.container}>
      <AppHeader
        titulo="Algoritmos Clínicos"
        icono="pulse-outline"
        accionIzquierda={{ icono: 'arrow-back', onPress: () => router.back() }}
        mostrarPerfil={false}
      />

      {cargando ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Preparando algoritmo...</Text>
        </View>
      ) : error || !definition || !currentNode ? (
        <View style={styles.emptyWrap}>
          <AlgoritmosEmptyState
            title="No se pudo abrir el algoritmo"
            description={error ?? 'La definición publicada no está disponible o está incompleta.'}
            actionLabel="Reintentar"
            onAction={recargar}
          />
        </View>
      ) : (
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: bottomInset }]} showsVerticalScrollIndicator={false}>
          <AlgoritmoHeaderCard
            currentNode={currentNode}
            definition={definition}
            step={step}
            totalSteps={definition.nodos.length}
          />

          <View style={styles.actionsRow}>
            <ActionButton
              icon="refresh-outline"
              label="Reiniciar"
              tone="secondary"
              onPress={reiniciar}
            />
            <ActionButton
              icon="arrow-back-outline"
              label="Atrás"
              tone="primary"
              onPress={retroceder}
              disabled={!canGoBack}
            />
          </View>

          <AlgorithmNodeRenderer node={currentNode} onSubmit={handleNodeSubmit} />
          <AlgoritmoRuntimeStateCard context={context} responses={responses} />
        </ScrollView>
      )}
    </View>
  );
}

function ActionButton({
  disabled = false,
  icon,
  label,
  onPress,
  tone,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  tone: 'primary' | 'secondary';
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.actionButton,
        tone === 'primary' ? styles.actionButtonPrimary : styles.actionButtonSecondary,
        disabled && styles.actionButtonDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.82}
    >
      <Ionicons
        name={icon}
        size={18}
        color={tone === 'primary' ? Colors.primaryDark : Colors.darkGray}
      />
      <Text
        style={[
          styles.actionButtonText,
          tone === 'primary' ? styles.actionButtonTextPrimary : styles.actionButtonTextSecondary,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    gap: Spacing.lg,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    padding: Spacing.xxxl,
  },
  loadingText: {
    ...Typography.bodySmall,
    color: Colors.darkGray,
  },
  emptyWrap: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    borderRadius: BorderRadius.large,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    ...Shadows.small,
  },
  actionButtonPrimary: {
    backgroundColor: Colors.primaryLight,
    borderColor: '#BFDBFE',
  },
  actionButtonSecondary: {
    backgroundColor: Colors.surface,
    borderColor: Colors.lightGray,
  },
  actionButtonDisabled: {
    opacity: 0.45,
  },
  actionButtonText: {
    ...Typography.bodySmall,
    fontWeight: '700',
  },
  actionButtonTextPrimary: {
    color: Colors.primaryDark,
  },
  actionButtonTextSecondary: {
    color: Colors.darkGray,
  },
});
