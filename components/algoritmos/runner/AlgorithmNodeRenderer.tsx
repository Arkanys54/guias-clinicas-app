import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../../constants/theme';
import type {
  NodoAlgoritmoDefinicionDto,
  OpcionNodoDefinicionDto,
} from '../../../services/algoritmos.types';
import { ContentBlocks } from './ContentBlocks';

interface Props {
  node: NodoAlgoritmoDefinicionDto;
  onSubmit: (answer?: unknown) => void;
}

export function AlgorithmNodeRenderer({ node, onSubmit }: Props) {
  const [textValue, setTextValue] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  useEffect(() => {
    setTextValue('');
    setSelectedOptions([]);
  }, [node.clave]);

  const title = useMemo(() => {
    if ('tituloPregunta' in node && node.tituloPregunta) return node.tituloPregunta;
    if ('titulo' in node && node.titulo) return node.titulo;
    return node.nombre;
  }, [node]);

  if (node.type === 'single_choice') {
    return (
      <CardShell title={title} subtitle={node.textoAyuda ?? undefined}>
        {(node.opciones ?? []).map((option) => (
          <ChoiceOption key={option.valor} option={option} onPress={() => onSubmit(option.valor)} />
        ))}
      </CardShell>
    );
  }

  if (node.type === 'multi_choice') {
    const min = node.minSelecciones ?? 0;
    const max = node.maxSelecciones ?? null;
    const puedeContinuar =
      selectedOptions.length >= min &&
      (node.permiteSinSeleccion || selectedOptions.length > 0 || min === 0) &&
      (max === null || selectedOptions.length <= max);

    return (
      <CardShell title={title} subtitle={node.textoAyuda ?? undefined}>
        {(node.opciones ?? []).map((option) => {
          const selected = selectedOptions.includes(option.valor);
          return (
            <TouchableOpacity
              key={option.valor}
              style={[styles.optionCard, selected && styles.optionCardSelected]}
              activeOpacity={0.82}
              onPress={() => {
                setSelectedOptions((current) => {
                  if (selected) return current.filter((item) => item !== option.valor);
                  if (max !== null && current.length >= max) return current;
                  return [...current, option.valor];
                });
              }}
            >
              <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                {selected && <Ionicons name="checkmark" size={14} color={Colors.white} />}
              </View>
              <View style={styles.optionBody}>
                <Text style={styles.optionTitle}>{option.etiqueta}</Text>
                {!!option.descripcion && <Text style={styles.optionDescription}>{option.descripcion}</Text>}
              </View>
            </TouchableOpacity>
          );
        })}

        <PrimaryButton
          label={node.etiquetaBotonContinuar || 'Continuar'}
          onPress={() => onSubmit(selectedOptions)}
          disabled={!puedeContinuar}
        />
      </CardShell>
    );
  }

  if (node.type === 'boolean') {
    return (
      <CardShell title={title} subtitle={node.textoAyuda ?? undefined}>
        <View style={styles.booleanRow}>
          <TouchableOpacity
            style={[styles.booleanButton, styles.booleanButtonTrue]}
            activeOpacity={0.82}
            onPress={() => onSubmit(node.valorVerdadero ?? 'si')}
          >
            <Text style={styles.booleanButtonText}>{node.etiquetaVerdadero || 'Sí'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.booleanButton, styles.booleanButtonFalse]}
            activeOpacity={0.82}
            onPress={() => onSubmit(node.valorFalso ?? 'no')}
          >
            <Text style={[styles.booleanButtonText, { color: Colors.danger }]}>{node.etiquetaFalso || 'No'}</Text>
          </TouchableOpacity>
        </View>
      </CardShell>
    );
  }

  if (node.type === 'numeric_input') {
    return (
      <CardShell title={title} subtitle={node.descripcion || undefined}>
        <InputField
          value={textValue}
          onChangeText={setTextValue}
          placeholder={node.placeholder || 'Ingresa un valor'}
          keyboardType="decimal-pad"
          helper={node.unidad ? `Unidad: ${node.unidad}` : undefined}
        />
        <PrimaryButton
          label={node.etiquetaBotonContinuar || 'Continuar'}
          onPress={() => onSubmit(textValue)}
          disabled={!textValue.trim()}
        />
      </CardShell>
    );
  }

  if (node.type === 'date_input') {
    return (
      <CardShell title={title} subtitle={node.descripcion || 'Usa formato YYYY-MM-DD si tu dispositivo no abre calendario.'}>
        <InputField
          value={textValue}
          onChangeText={setTextValue}
          placeholder={node.placeholder || 'YYYY-MM-DD'}
        />
        <PrimaryButton
          label={node.etiquetaBotonContinuar || 'Continuar'}
          onPress={() => onSubmit(textValue)}
          disabled={!textValue.trim()}
        />
      </CardShell>
    );
  }

  if (node.type === 'text_input') {
    return (
      <CardShell title={title} subtitle={node.descripcion || undefined}>
        <InputField
          value={textValue}
          onChangeText={setTextValue}
          placeholder={node.placeholder || 'Escribe aquí'}
          multiline
        />
        <PrimaryButton
          label={node.etiquetaBotonContinuar || 'Continuar'}
          onPress={() => onSubmit(textValue)}
          disabled={node.requerido ? !textValue.trim() : false}
        />
      </CardShell>
    );
  }

  if (node.type === 'result' || node.type === 'info') {
    return (
      <CardShell
        title={node.titulo || node.nombre}
        subtitle={node.subtitulo || undefined}
        tone={node.type === 'result' ? 'result' : 'info'}
      >
        <ContentBlocks blocks={node.bloques ?? []} tone={node.type === 'result' ? 'result' : 'info'} />
        <PrimaryButton
          label={node.accion?.etiqueta || (node.esTerminal ? 'Finalizar' : 'Continuar')}
          onPress={() => onSubmit()}
        />
      </CardShell>
    );
  }

  if (node.type === 'alert') {
    return (
      <CardShell title={node.titulo || node.nombre} tone="alert">
        {!!node.severidad && <SeverityBadge severity={node.severidad} />}
        <ContentBlocks blocks={node.bloques ?? []} tone="alert" />
        <PrimaryButton
          label={node.accion?.etiqueta || (node.esTerminal ? 'Finalizar' : 'Continuar')}
          onPress={() => onSubmit()}
        />
      </CardShell>
    );
  }

  return (
    <CardShell title={node.nombre}>
      <Text style={styles.unsupportedText}>Este tipo de nodo no tiene renderer móvil todavía.</Text>
    </CardShell>
  );
}

function CardShell({
  children,
  subtitle,
  title,
  tone = 'default',
}: React.PropsWithChildren<{ title: string; subtitle?: string; tone?: 'default' | 'result' | 'info' | 'alert' }>) {
  return (
    <View style={styles.scrollContent}>
      <View
        style={[
          styles.card,
          tone === 'result' && styles.cardResult,
          tone === 'info' && styles.cardInfo,
          tone === 'alert' && styles.cardAlert,
        ]}
      >
        <Text style={styles.cardTitle}>{title}</Text>
        {!!subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
        <View style={styles.cardBody}>{children}</View>
      </View>
    </View>
  );
}

function ChoiceOption({ option, onPress }: { option: OpcionNodoDefinicionDto; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.optionCard} onPress={onPress} activeOpacity={0.82}>
      <View style={styles.optionBody}>
        <Text style={styles.optionTitle}>{option.etiqueta}</Text>
        {!!option.descripcion && <Text style={styles.optionDescription}>{option.descripcion}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.primary} />
    </TouchableOpacity>
  );
}

function InputField({
  helper,
  keyboardType,
  multiline = false,
  onChangeText,
  placeholder,
  value,
}: {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'decimal-pad';
  multiline?: boolean;
  helper?: string;
}) {
  return (
    <View style={styles.inputWrap}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        style={[styles.input, multiline && styles.inputMultiline]}
        placeholderTextColor={Colors.gray}
      />
      {!!helper && <Text style={styles.helperText}>{helper}</Text>}
    </View>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const tone =
    severity === 'alta'
      ? { bg: '#FEE2E2', fg: '#B91C1C' }
      : severity === 'media'
        ? { bg: '#FEF3C7', fg: '#B45309' }
        : { bg: '#DBEAFE', fg: '#1D4ED8' };

  return (
    <View style={[styles.severityBadge, { backgroundColor: tone.bg }]}>
      <Text style={[styles.severityText, { color: tone.fg }]}>{severity}</Text>
    </View>
  );
}

function PrimaryButton({
  disabled = false,
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      style={[styles.primaryButton, disabled && styles.primaryButtonDisabled]}
    >
      <Text style={styles.primaryButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: Spacing.xxxl,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.large,
    padding: Spacing.xl,
    ...Shadows.medium,
    gap: Spacing.lg,
  },
  cardResult: {
    borderTopWidth: 4,
    borderTopColor: Colors.success,
  },
  cardInfo: {
    borderTopWidth: 4,
    borderTopColor: Colors.info,
  },
  cardAlert: {
    borderTopWidth: 4,
    borderTopColor: Colors.danger,
  },
  cardTitle: {
    ...Typography.h4,
    color: Colors.dark,
  },
  cardSubtitle: {
    ...Typography.bodySmall,
    color: Colors.darkGray,
  },
  cardBody: {
    gap: Spacing.md,
  },
  optionCard: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.large,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  optionCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  optionBody: {
    flex: 1,
    gap: 4,
  },
  optionTitle: {
    ...Typography.body,
    color: Colors.dark,
    fontWeight: '600',
  },
  optionDescription: {
    ...Typography.bodyXSmall,
    color: Colors.darkGray,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  booleanRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  booleanButton: {
    flex: 1,
    borderRadius: BorderRadius.large,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  booleanButtonTrue: {
    backgroundColor: '#ECFDF5',
    borderColor: '#BBF7D0',
  },
  booleanButtonFalse: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  booleanButtonText: {
    ...Typography.body,
    color: Colors.success,
    fontWeight: '700',
  },
  inputWrap: {
    gap: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    color: Colors.dark,
    ...Typography.body,
  },
  inputMultiline: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  helperText: {
    ...Typography.caption,
    color: Colors.gray,
  },
  severityBadge: {
    alignSelf: 'flex-start',
    borderRadius: BorderRadius.rounded,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
  },
  severityText: {
    ...Typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.large,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
  },
  primaryButtonDisabled: {
    opacity: 0.45,
  },
  primaryButtonText: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '700',
  },
  unsupportedText: {
    ...Typography.bodySmall,
    color: Colors.darkGray,
  },
});
