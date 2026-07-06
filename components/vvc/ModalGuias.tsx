import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../constants/theme';
import { FUENTES } from '../../constants/vvcTypes';

export function ModalGuias({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={m.container}>
        <View style={m.header}>
          <View style={m.headerLeft}>
            <Ionicons name="library-outline" size={20} color={Colors.primary} />
            <View>
              <Text style={m.title}>Fundamento academico</Text>
              <Text style={m.sub}>Guias clinicas de referencia</Text>
            </View>
          </View>
          <TouchableOpacity style={m.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <Ionicons name="close" size={18} color={Colors.gray} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.md }}>
          {FUENTES.map((f) => (
            <View key={f.sigla} style={[m.card, { borderLeftColor: f.color }]}>
              <View style={[m.siglaTag, { backgroundColor: f.color }]}>
                <Text style={m.siglaTxt}>{f.sigla}</Text>
              </View>
              <Text style={m.cardTitle}>{f.titulo}</Text>
              <Text style={m.cardYear}>Publicacion: {f.year}</Text>
            </View>
          ))}
          <View style={m.infoBox}>
            <View style={m.infoRow}>
              <Ionicons name="information-circle-outline" size={16} color={Colors.primary} />
              <Text style={m.infoTxt}>
                Las recomendaciones se basan en la sintesis de{' '}
                <Text style={{ fontWeight: '700' }}>CDC 2021, IDSA 2016, AWMF 2021 e IUSTI/WHO 2022</Text>.
                Para casos complejos, consultar el texto completo de cada guia.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const m = StyleSheet.create({
  container:  { flex: 1, backgroundColor: Colors.background },
  header:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.lg, paddingTop: 50, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  title:      { fontSize: 16, fontWeight: '600', color: Colors.dark },
  sub:        { ...Typography.bodySmall, color: Colors.gray },
  closeBtn:   { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.lightGray, alignItems: 'center', justifyContent: 'center' },
  card:       { backgroundColor: Colors.surface, borderRadius: BorderRadius.medium, padding: Spacing.lg, borderLeftWidth: 5, gap: Spacing.sm, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 3, elevation: 2 },
  siglaTag:   { alignSelf: 'flex-start', paddingVertical: Spacing.xs, paddingHorizontal: Spacing.md, borderRadius: BorderRadius.small },
  siglaTxt:   { fontSize: 12, fontWeight: '700', color: Colors.white, letterSpacing: 1 },
  cardTitle:  { ...Typography.bodySmall, fontWeight: '600', color: Colors.dark },
  cardYear:   { ...Typography.caption, color: Colors.gray },
  infoBox:    { backgroundColor: Colors.primaryLight, borderRadius: BorderRadius.medium, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.primary },
  infoRow:    { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  infoTxt:    { flex: 1, ...Typography.bodySmall, color: Colors.primary, lineHeight: 20 },
});