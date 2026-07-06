import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IoniconName, STEP_LABELS, STEP_ORDER, type Paso } from '../../constants/vvcTypes';
import { BorderRadius, Colors, Spacing, Typography } from '../../constants/theme';

// ── ProgressBar ───────────────────────────────────────────────────────────────

export function ProgressBar({ paso }: { paso: Paso }) {
  const idx = STEP_ORDER.indexOf(paso);
  const pct = ((idx + 1) / STEP_ORDER.length) * 100;
  return (
    <View style={pg.wrapper}>
      <View style={pg.track}>
        <View style={[pg.fill, { width: `${pct}%` as any }]} />
      </View>
      <View style={pg.labels}>
        {STEP_LABELS.map((l, i) => (
          <Text key={i} style={[pg.label, i < idx && pg.labelDone, i === idx && pg.labelActive]}>
            {l}
          </Text>
        ))}
      </View>
    </View>
  );
}

// ── CardTitle ─────────────────────────────────────────────────────────────────

export function CardTitle({
  icono, text, color = Colors.primary,
}: { icono: IoniconName; text: string; color?: string }) {
  return (
    <View style={sh.cardTitleRow}>
      <Ionicons name={icono} size={14} color={color} />
      <Text style={[sh.cardTitle, { color }]}>{text}</Text>
    </View>
  );
}

// ── Divider ───────────────────────────────────────────────────────────────────

export function Divider() {
  return <View style={sh.divider} />;
}

// ── TtoItem ───────────────────────────────────────────────────────────────────

export function TtoItem({
  num, color, titulo, dosis, nota,
}: { num: string; color: string; titulo: string; dosis: string; nota?: string }) {
  return (
    <View style={[sh.ttoRow, { borderLeftColor: color }]}>
      <View style={[sh.ttoNum, { backgroundColor: color }]}>
        <Text style={sh.ttoNumTxt}>{num}</Text>
      </View> 
      <View style={{ flex: 1, gap: Spacing.xs }}>
        <Text style={sh.ttoTitulo}>{titulo}</Text>
        <Text style={[sh.ttoDosis, { color }]}>{dosis}</Text>
        {nota ? <Text style={sh.ttoNota}>{nota}</Text> : null}
      </View>
    </View>
  );
}

// ── AlertBox ──────────────────────────────────────────────────────────────────

export function AlertBox({
  icono, iconColor, children, bg, border, textColor = Colors.dark,
}: {
  icono: IoniconName; iconColor?: string; children: React.ReactNode;
  bg: string; border: string; textColor?: string;
}) {
  return (
    <View style={[sh.alertBox, { backgroundColor: bg, borderColor: border }]}>
      <Ionicons name={icono} size={16} color={iconColor ?? border} style={{ marginTop: 2 }} />
      <View style={{ flex: 1 }}>
        {typeof children === 'string'
          ? <Text style={[sh.alertTxt, { color: textColor }]}>{children}</Text>
          : children}
      </View>
    </View>
  );
}

// ── Bullet ────────────────────────────────────────────────────────────────────

export function Bullet({ text, color = Colors.primary }: { text: string; color?: string }) {
  return (
    <View style={sh.bulletRow}>
      <Ionicons name="ellipse" size={6} color={color} style={{ marginTop: 6 }} />
      <Text style={sh.bulletTxt}>{text}</Text>
    </View>
  );
}

// ── NavRow ────────────────────────────────────────────────────────────────────

export function NavRow({
  onBack, onNext, nextLabel = 'Continuar', nextColor = Colors.primary,
}: { onBack?: () => void; onNext: () => void; nextLabel?: string; nextColor?: string }) {
  return (
    <View style={sh.navRow}>
      {onBack && (
        <TouchableOpacity style={sh.btnBack} onPress={onBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={16} color={Colors.gray} />
          <Text style={sh.btnBackTxt}>Atras</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[sh.btnNext, { backgroundColor: nextColor }]}
        onPress={onNext}
        activeOpacity={0.7}
      >
        <Text style={sh.btnNextTxt}>{nextLabel}</Text>
        <Ionicons name="arrow-forward" size={16} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

// ── NavGuias ──────────────────────────────────────────────────────────────────
// Reemplaza el GuiasBtn de texto simple: ofrece ver el fundamento académico
// o navegar directamente a la sección de Guías Clínicas de la app.

export function NavGuias({
  onVerFundamento,
  onIrAGuias,
}: { onVerFundamento: () => void; onIrAGuias: () => void }) {
  return (
    <View style={ng.wrapper}>
      <View style={ng.divider}>
        <View style={ng.line} />
        <Text style={ng.dividerTxt}>Recursos</Text>
        <View style={ng.line} />
      </View>
      <View style={ng.row}>
        <TouchableOpacity style={ng.btn} onPress={onVerFundamento} activeOpacity={0.75}>
          <View style={[ng.iconWrap, { backgroundColor: Colors.primaryLight }]}>
            <Ionicons name="document-text-outline" size={18} color={Colors.primary} />
          </View>
          <Text style={[ng.btnTxt, { color: Colors.primary }]}>Fundamento{'\n'}académico</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[ng.btn, ng.btnPrimary]} onPress={onIrAGuias} activeOpacity={0.75}>
          <View style={[ng.iconWrap, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <Ionicons name="library-outline" size={18} color={Colors.white} />
          </View>
          <Text style={[ng.btnTxt, { color: Colors.white }]}>Ir a guías{'\n'}clínicas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Estilos ───────────────────────────────────────────────────────────────────

export const sh = StyleSheet.create({
  ttoRow:        { flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start', borderLeftWidth: 4, paddingLeft: Spacing.md, paddingVertical: Spacing.xs },
  ttoNum:        { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  ttoNumTxt:     { color: Colors.white, fontWeight: '800', fontSize: 11 },
  ttoTitulo:     { ...Typography.caption, color: Colors.gray },
  ttoDosis:      { fontSize: 15, fontWeight: '700', lineHeight: 20 },
  ttoNota:       { ...Typography.caption, color: Colors.gray, lineHeight: 16 },
  alertBox:      { borderRadius: BorderRadius.medium, padding: Spacing.md, borderWidth: 1, flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start', marginTop: Spacing.xs },
  alertTxt:      { ...Typography.bodyXSmall, lineHeight: 18, flex: 1 },
  bulletRow:     { flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start' },
  bulletTxt:     { ...Typography.bodySmall, color: Colors.darkGray, flex: 1, lineHeight: 20 },
  bodyTxt:       { ...Typography.bodySmall, color: Colors.dark, lineHeight: 20, flex: 1 },
  diagResultRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start' },
  navRow:        { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.xs },
  btnBack:       { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs, paddingVertical: Spacing.md, borderRadius: BorderRadius.medium, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surface },
  btnBackTxt:    { ...Typography.label, color: Colors.gray },
  btnNext:       { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs, paddingVertical: Spacing.md, borderRadius: BorderRadius.medium },
  btnNextTxt:    { ...Typography.label, color: Colors.white },
  cardTitleRow:  { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  cardTitle:     { fontSize: 11, fontWeight: '800', letterSpacing: 0.8, textTransform: 'uppercase' },
  divider:       { height: 1, backgroundColor: Colors.border, marginVertical: 2 },
});

const pg = StyleSheet.create({
  wrapper:     { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  track:       { height: 4, backgroundColor: Colors.lightGray, borderRadius: 2, overflow: 'hidden' },
  fill:        { height: '100%', backgroundColor: Colors.primary, borderRadius: 2 },
  labels:      { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  label:       { fontSize: 9, color: Colors.gray, fontWeight: '500' },
  labelDone:   { color: Colors.primary, opacity: 0.5 },
  labelActive: { color: Colors.primary, fontWeight: '800' },
});

const ng = StyleSheet.create({
  wrapper:    { gap: Spacing.md, marginTop: Spacing.md },
  divider:    { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  line:       { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerTxt: { ...Typography.caption, color: Colors.gray, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6 },
  row:        { flexDirection: 'row', gap: Spacing.md },
  btn:        { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.md, borderRadius: BorderRadius.large, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface },
  btnPrimary: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  iconWrap:   { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  btnTxt:     { fontSize: 13, fontWeight: '700', lineHeight: 18, flex: 1 },
});