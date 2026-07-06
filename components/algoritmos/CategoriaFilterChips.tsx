import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../constants/theme';

interface CategoriaItem {
  clave: string;
  nombre: string;
}

interface Props {
  categoriaActiva: string;
  categorias: CategoriaItem[];
  onSelect: (clave: string) => void;
}

export function CategoriaFilterChips({ categoriaActiva, categorias, onSelect }: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Filtrar por categoría</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
        {categorias.map((categoria) => {
          const activa = categoriaActiva === categoria.clave;
          return (
            <TouchableOpacity
              key={categoria.clave}
              style={[styles.chip, activa && styles.chipActive]}
              onPress={() => onSelect(categoria.clave)}
              activeOpacity={0.82}
            >
              <Text style={[styles.chipText, activa && styles.chipTextActive]}>{categoria.nombre}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.sm,
  },
  label: {
    ...Typography.labelSmall,
    color: Colors.darkGray,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  content: {
    gap: Spacing.sm,
    paddingRight: Spacing.lg,
  },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.rounded,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    ...Typography.bodySmall,
    color: Colors.dark,
    fontWeight: '600',
  },
  chipTextActive: {
    color: Colors.white,
  },
});
