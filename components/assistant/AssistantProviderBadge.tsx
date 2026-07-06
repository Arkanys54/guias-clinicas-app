import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  BorderRadius,
  Colors,
  Spacing,
  Typography,
} from "../../constants/theme";
import type { AssistantProviderStatusDto } from "../../services/assistant.types";

interface Props {
  providerStatus: AssistantProviderStatusDto | null;
}

export function AssistantProviderBadge({ providerStatus }: Props) {
  const configurado = providerStatus?.configurado === true;

  return (
    <View
      style={[
        styles.badge,
        configurado ? styles.badgeOk : styles.badgeFallback,
      ]}
    >
      <Ionicons
        name={configurado ? "sparkles-outline" : "shield-checkmark-outline"}
        size={16}
        color={configurado ? Colors.primaryDark : Colors.darkGray}
      />
      <View style={styles.texts}>
        <Text style={styles.title}>
          {configurado
            ? `${providerStatus?.provider ?? "Gemini"} · ${providerStatus?.model ?? "modelo activo"}`
            : "Modo local seguro"}
        </Text>
        <Text style={styles.description}>
          {configurado
            ? "Respuesta asistida por LLM con acciones controladas por el backend."
            : "El chat sigue operativo aunque la clave del proveedor no esté configurada."}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: BorderRadius.large,
    padding: Spacing.md,
    flexDirection: "row",
    gap: Spacing.sm,
    alignItems: "flex-start",
  },
  badgeOk: {
    backgroundColor: Colors.accentLight,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  badgeFallback: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...Typography.label,
    color: Colors.dark,
  },
  description: {
    ...Typography.caption,
    color: Colors.darkGray,
  },
});
