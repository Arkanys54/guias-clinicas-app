import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { cambiarPassword } from '../services/api';

type Seccion = 'datos' | 'password';

export default function PerfilScreen() {
  const { usuario, cerrarSesion } = useAuth();
  const router = useRouter();

  const [seccion, setSeccion] = useState<Seccion>('datos');

  const [passActual, setPassActual]   = useState('');
  const [passNueva, setPassNueva]     = useState('');
  const [passConfirm, setPassConfirm] = useState('');
  const [verActual, setVerActual]     = useState(false);
  const [verNueva, setVerNueva]       = useState(false);
  const [verConfirm, setVerConfirm]   = useState(false);
  const [guardando, setGuardando]     = useState(false);
  const [errorPass, setErrorPass]     = useState<string | null>(null);

  const insets = useSafeAreaInsets();

  if (!usuario) return null;

  const formatearFecha = (fecha: string) =>
    new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

  const getRolColor = (rol: string) => {
    if (rol === 'Admin')   return Colors.danger;
    if (rol === 'Empresa') return Colors.primary;
    return Colors.success;
  };

  const getRolIcono = (rol: string): keyof typeof Ionicons.glyphMap => {
    if (rol === 'Admin')   return 'shield-checkmark-outline';
    if (rol === 'Empresa') return 'business-outline';
    return 'person-outline';
  };

  const handleCambiarPassword = async () => {
    setErrorPass(null);
    if (!passActual || !passNueva || !passConfirm) { setErrorPass('Todos los campos son obligatorios.'); return; }
    if (passNueva !== passConfirm) { setErrorPass('La nueva contraseña y su confirmación no coinciden.'); return; }
    if (passNueva.length < 8) { setErrorPass('La nueva contraseña debe tener al menos 8 caracteres.'); return; }

    setGuardando(true);
    const resultado = await cambiarPassword(usuario.id, {
      passwordActual: passActual,
      passwordNueva: passNueva,
      confirmarPassword: passConfirm,
    });
    setGuardando(false);

    if (resultado.success) {
      Alert.alert('Contraseña actualizada', 'Tu contraseña fue cambiada correctamente.', [
        { text: 'OK', onPress: () => { setPassActual(''); setPassNueva(''); setPassConfirm(''); } },
      ]);
    } else {
      setErrorPass(resultado.error ?? 'Error al cambiar la contraseña.');
    }
  };

  const handleCerrarSesion = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro de que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir',
        style: 'destructive',
        onPress: async () => {
          await cerrarSesion();
          router.replace('/login');
        },
      },
    ]);
  };

  const rolColor = getRolColor(usuario.rol);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color={Colors.white} />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>

        <View style={styles.avatarWrap}>
          <Ionicons name="person" size={36} color={Colors.white} />
        </View>

        <Text style={[Typography.h3, styles.nombreHeader]}>
          {usuario.nombre} {usuario.apellido}
        </Text>

        <View style={[styles.rolBadge, { backgroundColor: rolColor + '25', borderColor: rolColor + '50' }]}>
          <Ionicons name={getRolIcono(usuario.rol)} size={12} color={rolColor} />
          <Text style={[styles.rolBadgeText, { color: rolColor }]}>{usuario.rol}</Text>
        </View>
      </View>

      {/* ── Selector de sección ── */}
      <View style={styles.selector}>
        {([
          { key: 'datos'    as Seccion, label: 'Mis datos',   icono: 'person-outline'    as keyof typeof Ionicons.glyphMap },
          { key: 'password' as Seccion, label: 'Contraseña',  icono: 'lock-closed-outline' as keyof typeof Ionicons.glyphMap },
        ]).map((op) => (
          <TouchableOpacity
            key={op.key}
            style={[styles.selectorBtn, seccion === op.key && styles.selectorBtnActive]}
            onPress={() => setSeccion(op.key)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={op.icono}
              size={15}
              color={seccion === op.key ? Colors.primary : Colors.gray}
            />
            <Text style={[styles.selectorTxt, seccion === op.key && styles.selectorTxtActive]}>
              {op.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 40 + insets.bottom }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── DATOS PERSONALES ── */}
        {seccion === 'datos' && (
          <View style={styles.card}>
            {[
              { icono: 'person-outline'    as keyof typeof Ionicons.glyphMap, label: 'Nombre',        valor: `${usuario.nombre} ${usuario.apellido}` },
              { icono: 'mail-outline'      as keyof typeof Ionicons.glyphMap, label: 'Correo',        valor: usuario.email },
              { icono: 'business-outline'  as keyof typeof Ionicons.glyphMap, label: 'Empresa',       valor: usuario.nombreEmpresa },
              { icono: 'ribbon-outline'    as keyof typeof Ionicons.glyphMap, label: 'Rol',           valor: usuario.rol },
              { icono: 'calendar-outline'  as keyof typeof Ionicons.glyphMap, label: 'Registro',      valor: formatearFecha(usuario.fechaRegistro) },
              ...(usuario.ultimoAcceso ? [{ icono: 'time-outline' as keyof typeof Ionicons.glyphMap, label: 'Último acceso', valor: formatearFecha(usuario.ultimoAcceso) }] : []),
            ].map((fila, i, arr) => (
              <View key={fila.label}>
                <View style={styles.fila}>
                  <View style={styles.filaLeft}>
                    <Ionicons name={fila.icono} size={15} color={Colors.gray} />
                    <Text style={styles.filaLabel}>{fila.label}</Text>
                  </View>
                  <Text style={styles.filaValor} numberOfLines={2}>{fila.valor}</Text>
                </View>
                {i < arr.length - 1 && <View style={styles.separador} />}
              </View>
            ))}
          </View>
        )}

        {/* ── CAMBIAR CONTRASEÑA ── */}
        {seccion === 'password' && (
          <View style={styles.card}>

            <CampoPassword
              label="Contraseña actual"
              value={passActual}
              onChangeText={(t) => { setPassActual(t); setErrorPass(null); }}
              ver={verActual}
              onToggleVer={() => setVerActual((v) => !v)}
              editable={!guardando}
            />
            <CampoPassword
              label="Nueva contraseña"
              value={passNueva}
              onChangeText={(t) => { setPassNueva(t); setErrorPass(null); }}
              ver={verNueva}
              onToggleVer={() => setVerNueva((v) => !v)}
              editable={!guardando}
            />
            <CampoPassword
              label="Confirmar nueva contraseña"
              value={passConfirm}
              onChangeText={(t) => { setPassConfirm(t); setErrorPass(null); }}
              ver={verConfirm}
              onToggleVer={() => setVerConfirm((v) => !v)}
              editable={!guardando}
            />

            {!!errorPass && (
              <View style={styles.errorBox}>
                <Ionicons name="warning-outline" size={15} color={Colors.danger} />
                <Text style={styles.errorTxt}>{errorPass}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.botonGuardar, guardando && { opacity: 0.7 }]}
              onPress={handleCambiarPassword}
              disabled={guardando}
              activeOpacity={0.85}
            >
              {guardando ? (
                <ActivityIndicator color={Colors.white} size="small" />
              ) : (
                <View style={styles.botonInner}>
                  <Ionicons name="checkmark-circle-outline" size={18} color={Colors.white} />
                  <Text style={styles.botonGuardarTxt}>Actualizar contraseña</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.hintWrap}>
              <Ionicons name="information-circle-outline" size={13} color={Colors.gray} />
              <Text style={styles.hint}>
                Mínimo 8 caracteres · Una mayúscula · Un número · Un carácter especial
              </Text>
            </View>
          </View>
        )}

        {/* ── Cerrar sesión ── */}
        <TouchableOpacity
          style={styles.botonSalir}
          onPress={handleCerrarSesion}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={18} color={Colors.danger} />
          <Text style={styles.botonSalirTxt}>Cerrar sesión</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Subcomponente CampoPassword ──────────────────────────────────────────────

interface CampoPasswordProps {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  ver: boolean;
  onToggleVer: () => void;
  editable: boolean;
}

function CampoPassword({ label, value, onChangeText, ver, onToggleVer, editable }: CampoPasswordProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.campo}>
      <Text style={styles.campoLabel}>{label}</Text>
      <View style={[styles.inputWrapper, focused && styles.inputFocused]}>
        <Ionicons name="lock-closed-outline" size={17} color={focused ? Colors.primary : Colors.gray} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          secureTextEntry={!ver}
          autoCapitalize="none"
          autoCorrect={false}
          editable={editable}
          placeholderTextColor={Colors.gray}
          placeholder="••••••••"
        />
        <TouchableOpacity onPress={onToggleVer} style={styles.togglePass} activeOpacity={0.7}>
          <Ionicons name={ver ? 'eye-off-outline' : 'eye-outline'} size={17} color={Colors.gray} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Header
  header: {
    backgroundColor: Colors.primary,
    paddingBottom: 28,
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  backBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
    opacity: 0.85,
  },
  backText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  avatarWrap: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    marginBottom: Spacing.md,
  },
  nombreHeader: {
    color: Colors.white,
    textAlign: 'center',
  },
  rolBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.sm,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.small,
    borderWidth: 1,
  },
  rolBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // Selector
  selector: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    backgroundColor: Colors.light,
    borderRadius: BorderRadius.medium,
    padding: 4,
    gap: 4,
  },
  selectorBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.medium - 2,
  },
  selectorBtnActive: {
    backgroundColor: Colors.surface,
    ...Shadows.small,
  },
  selectorTxt: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.gray,
  },
  selectorTxtActive: {
    color: Colors.primary,
  },

  // Scroll
  scroll: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    gap: Spacing.lg,
  },

  // Card
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.large,
    padding: Spacing.lg,
    ...Shadows.medium,
    gap: Spacing.md,
  },

  // Fila de dato
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  filaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  filaLabel: {
    color: Colors.gray,
    fontSize: 13,
    fontWeight: '600',
  },
  filaValor: {
    color: Colors.dark,
    fontSize: 14,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  separador: {
    height: 1,
    backgroundColor: Colors.border,
  },

  // Campos password
  campo: { gap: Spacing.sm },
  campoLabel: {
    color: Colors.dark,
    fontSize: 13,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light,
    borderRadius: BorderRadius.medium,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  inputFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.lg,
    fontSize: 15,
    color: Colors.dark,
  },
  togglePass: { padding: Spacing.sm },

  // Error
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: '#FEF2F2',
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.danger,
  },
  errorTxt: {
    color: Colors.danger,
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },

  // Hint
  hintWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs,
  },
  hint: {
    flex: 1,
    color: Colors.gray,
    fontSize: 11,
    lineHeight: 16,
  },

  // Botón guardar
  botonGuardar: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.medium,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
    ...Shadows.medium,
  },
  botonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  botonGuardarTxt: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
  },

  // Cerrar sesión
  botonSalir: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: '#FEF2F2',
    borderRadius: BorderRadius.medium,
    paddingVertical: Spacing.lg,
    borderWidth: 1.5,
    borderColor: Colors.danger,
  },
  botonSalirTxt: {
    color: Colors.danger,
    fontSize: 15,
    fontWeight: '700',
  },
});