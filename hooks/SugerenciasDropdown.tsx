import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from "../constants/theme";
import { SugerenciaHallazgoDto } from "../services/api.types";

interface SugerenciasDropdownProps {
  sugerencias: SugerenciaHallazgoDto[];
  cargando: boolean;
  visible: boolean;
  onSelectSugerencia: (sugerencia: SugerenciaHallazgoDto) => void;
  onClose: () => void;
  termino: string;
}

export const SugerenciasDropdown: React.FC<SugerenciasDropdownProps> = ({
  sugerencias,
  cargando,
  visible,
  onSelectSugerencia,
  onClose,
  termino,
}) => {
  if (!visible) return null;


  return (
    <View style={styles.dropdown}>
      {cargando ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={Colors.primary} size="small" />
          <Text style={[Typography.bodySmall, { color: Colors.gray, marginLeft: Spacing.md }]}>
            Buscando...
          </Text>
        </View>
      ) : sugerencias.length > 0 ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
        >
          {sugerencias.map((item) => (
            <TouchableOpacity
              key={item.hallazgoId.toString()}
              style={styles.sugerenciaItem}
              onPress={() => {
                onSelectSugerencia(item);
                onClose();
              }}
              activeOpacity={0.7}
            >
              <View style={styles.sugerenciaContent}>
                <Text
                  style={[Typography.label, { color: Colors.dark }]}
                  numberOfLines={1}
                >
                  {item.hallazgoNombre}
                </Text>
                <Text
                  style={[Typography.bodyXSmall, { color: Colors.gray, marginTop: Spacing.xs }]}
                  numberOfLines={2}
                >
                  {item.hallazgoDescripcionResumida}
                </Text>
                <View style={styles.relevanciaSmall}>
                  <Text style={[Typography.caption, { color: Colors.primary }]}>
                    Relevancia: {Math.round(item.relevanciaScore)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={[Typography.bodySmall, { color: Colors.gray }]}>
            No se encontraron resultados para: {termino}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: BorderRadius.large,
    borderBottomRightRadius: BorderRadius.large,
    marginTop: -BorderRadius.large,
    borderWidth: 1,
    borderColor: Colors.border,
    borderTopWidth: 0,
    maxHeight: 300,
    zIndex: 1000,
    ...Shadows.medium,
  },
  sugerenciaItem: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  sugerenciaContent: {
    gap: Spacing.xs,
  },
  relevanciaSmall: {
    marginTop: Spacing.xs,
  },
  loadingContainer: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
  },
});