import { Href, useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BorderRadius,
  Colors,
  Spacing,
  Typography,
} from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { useAssistantChat } from "../../hooks/useAssistantChat";
import type { AssistantActionDto } from "../../services/assistant.types";
import { getBottomViewportInset } from "../../utils/layout";
import { AppHeader } from "../Appheader";
import { AssistantComposer } from "./AssistantComposer";
import { AssistantHeroCard } from "./AssistantHeroCard";
import { AssistantMessageBubble } from "./AssistantMessageBubble";
import { AssistantQuickPrompts } from "./AssistantQuickPrompts";

interface Props {
  initialMessage?: string | null;
  autoSendInitial?: boolean;
}

export function AssistantScreen({
  initialMessage,
  autoSendInitial = false,
}: Props) {
  const router = useRouter();
  const { usuario } = useAuth();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const lastHandledInitialMessageRef = useRef<string | null>(null);

  // Solo necesitamos saber si el teclado está visible (no su altura): el
  // empuje del contenido lo hace `adjustResize` del sistema.
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const {
    messages,
    draft,
    setDraft,
    loading,
    error,
    quickPrompts,
    sendMessage,
  } = useAssistantChat();

  const sortedMessages = useMemo(() => messages, [messages]);

  // Inset inferior (alto real de la barra de navegación) cuando el teclado
  // está cerrado. Con el teclado abierto la barra queda tapada por el teclado,
  // así que el footer se pega al borde del teclado con un padding mínimo.
  const bottomInset = getBottomViewportInset(insets.bottom);
  // Teclado cerrado: pegamos el composer a la barra de navegación dejando solo
  // una pequeña holgura (inset real menos Spacing.md). Teclado abierto: mínimo.
  const footerBottomPadding = keyboardVisible
    ? Spacing.sm
    : Math.max(bottomInset + Spacing.sm, Spacing.xs);

  // Reanimated (incluido en Expo Go) expone la altura real del teclado y
  // funciona bajo edge-to-edge en Android. Empujamos el cuerpo (lista +
  // composer) hacia arriba exactamente esa altura, de modo que el composer
  // quede justo encima del teclado y vuelva a su sitio al cerrarlo.
  const keyboard = useAnimatedKeyboard();
  const animatedBodyStyle = useAnimatedStyle(() => ({
    paddingBottom: keyboard.height.value,
  }));

  useEffect(() => {
    // Eventos nativos según plataforma
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, () => {
      setKeyboardVisible(true);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Scroll automático cuando llegan mensajes nuevos
  useEffect(() => {
    if (sortedMessages.length === 0) return;
    const timer = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [sortedMessages.length]);

  // Mensaje inicial pasado por params
  useEffect(() => {
    if (!initialMessage?.trim()) return;
    if (lastHandledInitialMessageRef.current === initialMessage) return;

    lastHandledInitialMessageRef.current = initialMessage;

    if (autoSendInitial) {
      void sendMessage(initialMessage);
      return;
    }

    setDraft(initialMessage);
  }, [autoSendInitial, initialMessage, sendMessage, setDraft]);

  const handleAction = (action: AssistantActionDto) => {
    switch (action.type) {
      case "open_algorithm":
      case "explain_current_node":
        if (action.algorithmId) {
          router.push({
            pathname: "/algoritmos/[algoritmoId]" as Href,
            params: { algoritmoId: String(action.algorithmId) },
          } as Href);
        }
        break;
      case "open_algorithms_catalog":
        router.push("/algoritmos" as Href);
        break;
      case "open_search":
        router.push(
          (usuario?.rol === "Usuario" ? "/(tabs)/guias" : "/(tabs)") as Href,
        );
        break;
      default:
        if (action.route) router.push(action.route as Href);
    }
  };

  // Contenido principal de la pantalla. El Animated.View con paddingBottom =
  // altura del teclado (vía useAnimatedKeyboard de Reanimated) sube la lista +
  // composer por encima del teclado y los devuelve a su posición al cerrarlo.
  const renderContent = () => (
    <Animated.View style={[styles.body, animatedBodyStyle]}>
      <FlatList
        ref={flatListRef}
        style={styles.list}
        data={sortedMessages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
        overScrollMode="always"
        bounces={true}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <AssistantHeroCard />
            <AssistantQuickPrompts
              prompts={quickPrompts}
              onSelect={(prompt) => void sendMessage(prompt)}
            />
            {!!error && (
              <View style={styles.errorCard}>
                <Text style={styles.errorTitle}>Error en la consulta</Text>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <AssistantMessageBubble item={item} onPressAction={handleAction} />
        )}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
        showsVerticalScrollIndicator={true}
      />

      {/* Padding inferior: inset real con teclado cerrado, mínimo con teclado abierto */}
      <View style={[styles.footer, { paddingBottom: footerBottomPadding }]}>
        <Text style={styles.footerLabel}>
          El asistente puede cometer errores. Verifica la información clínica.
        </Text>
        <AssistantComposer
          value={draft}
          onChange={setDraft}
          onSubmit={() => void sendMessage(draft)}
          loading={loading}
        />
      </View>
    </Animated.View>
  );

  // Un solo layout para iOS y Android: useAnimatedKeyboard (Reanimated) maneja
  // el teclado de forma consistente, incluso con edge-to-edge en Android, sin
  // necesidad de módulos nativos extra (compatible con Expo Go).
  return (
    <View style={styles.container}>
      <AppHeader
        titulo="Asistente Clínico"
        icono="chatbubbles-outline"
        accionIzquierda={{ icono: "arrow-back", onPress: () => router.back() }}
      />
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  body: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  headerBlock: {
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  errorCard: {
    backgroundColor: "#FCE8E6",
    borderRadius: BorderRadius.large,
    padding: Spacing.md,
    gap: 4,
  },
  errorTitle: {
    ...Typography.label,
    color: Colors.danger,
  },
  errorText: {
    ...Typography.bodySmall,
    color: "#7A1F17",
  },
  footer: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerLabel: {
    ...Typography.caption,
    color: Colors.darkGray,
    paddingHorizontal: 2,
    marginBottom: 4,
  },
});
