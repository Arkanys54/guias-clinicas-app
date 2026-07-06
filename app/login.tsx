import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AppLogo } from '../components/branding/AppLogo';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

// ─── Pantalla de login ────────────────────────────────────────────

export default function LoginScreen() {
  const { iniciarSesion } = useAuth();
  const router = useRouter();

  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [cargando, setCargando]       = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [emailFocused, setEmailFocused]       = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const passwordInputRef = useRef<TextInput>(null);

  const handleLogin = async () => {
    Keyboard.dismiss();
    setError(null);
    if (!email.trim()) { setError('El email es obligatorio.'); return; }
    if (!password)     { setError('La contraseña es obligatoria.'); return; }

    setCargando(true);
    const resultado = await iniciarSesion({ email: email.trim().toLowerCase(), password });
    setCargando(false);

    if (resultado.success) {
      const rol = resultado.usuario?.rol;
      if (rol === 'Usuario') {
        router.replace('/(tabs)/guias');
      } else {
        router.replace('/(tabs)');
      }
    } else {
      setError(resultado.error ?? 'Error al iniciar sesión.');
    }
  };

  const emailError    = !!error && !email.trim();
  const passwordError = !!error && !password;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAwareScrollView
        style={styles.root}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        bounces={false}
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 80}
        enableAutomaticScroll={true}
      >
        {/* Detalles decorativos */}
        <View pointerEvents="none" style={styles.decorTop} />
        <View pointerEvents="none" style={styles.decorBottom} />

        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.logoWrap}>
            <AppLogo variant="symbol" width={46} height={36} />
          </View>
          <AppLogo variant="wordmark" width={140} height={34} />
          <Text style={[Typography.h1, styles.titulo]}>Guías Clínicas</Text>
          <Text style={[Typography.bodySmall, styles.subtitulo]}>
            Plataforma clínica corporativa para consulta, decisión y entrenamiento
          </Text>
        </View>

        {/* ── Card ── */}
        <View style={styles.card}>

          {/* Título card */}
          <View style={styles.cardHeaderText}>
            <Text style={styles.cardEyebrow}>Acceso seguro</Text>
            <Text style={styles.cardTitulo}>Bienvenido de nuevo</Text>
          </View>

          {/* Email */}
          <View style={styles.campo}>
            <Text style={styles.labelCampo}>Correo electrónico</Text>
            <View style={[
              styles.inputWrapper,
              emailFocused && styles.inputFocused,
              emailError && styles.inputError,
            ]}>
              <Ionicons
                name="mail-outline"
                size={18}
                color={emailError ? Colors.danger : emailFocused ? Colors.primary : Colors.gray}
              />
              <TextInput
                style={styles.input}
                placeholder="ejemplo@correo.com"
                placeholderTextColor={Colors.gray}
                value={email}
                onChangeText={(t) => { setEmail(t); setError(null); }}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!cargando}
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>
          </View>

          {/* Contraseña */}
          <View style={styles.campo}>
            <Text style={styles.labelCampo}>Contraseña</Text>
            <View style={[
              styles.inputWrapper,
              passwordFocused && styles.inputFocused,
              passwordError && styles.inputError,
            ]}>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={passwordError ? Colors.danger : passwordFocused ? Colors.primary : Colors.gray}
              />
              <TextInput
                ref={passwordInputRef}
                style={styles.input}
                placeholder="Tu contraseña"
                placeholderTextColor={Colors.gray}
                value={password}
                onChangeText={(t) => { setPassword(t); setError(null); }}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                secureTextEntry={!verPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!cargando}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity
                onPress={() => setVerPassword((v) => !v)}
                style={styles.togglePassword}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={verPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={Colors.gray}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Error */}
          {!!error && (
            <View style={styles.errorBox}>
              <Ionicons name="warning-outline" size={15} color={Colors.danger} />
              <Text style={styles.errorTexto}>{error}</Text>
            </View>
          )}

          {/* Botón login */}
          <TouchableOpacity
            style={[styles.botonLogin, cargando && styles.botonLoginDeshabilitado]}
            onPress={handleLogin}
            disabled={cargando}
            activeOpacity={0.85}
          >
            {cargando ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <View style={styles.botonLoginInner}>
                <Text style={styles.botonLoginTexto}>Iniciar sesión</Text>
                <Ionicons name="arrow-forward" size={18} color={Colors.white} />
              </View>
            )}
          </TouchableOpacity>

        </View>

        <View style={styles.footerWrap}>
          <Ionicons name="shield-checkmark-outline" size={13} color="rgba(255,255,255,0.5)" />
          <Text style={styles.footer}>Sistema de Búsqueda de Guías Clínicas</Text>
        </View>

      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
}

// ─── Estilos login ────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.primary },
  decorTop: {
    position: 'absolute',
    top: -60, right: -50,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: Colors.primaryDark, opacity: 0.4,
  },
  decorBottom: {
    position: 'absolute',
    bottom: -40, left: -60,
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: Colors.accent, opacity: 0.12,
  },
  scrollContent: {
    minHeight: Dimensions.get('window').height,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  header: { alignItems: 'center', marginBottom: Spacing.xxl },
  logoWrap: {
    width: 84, height: 84, borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.24)',
  },
  titulo:    { color: Colors.white, textAlign: 'center', marginTop: Spacing.md },
  subtitulo: { color: 'rgba(255,255,255,0.78)', marginTop: Spacing.sm, textAlign: 'center', maxWidth: 290 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.rounded,
    padding: Spacing.xl,
    gap: Spacing.lg,
    ...Shadows.medium,
  },
  cardHeaderText: {
    gap: 2,
  },
  cardEyebrow: {
    ...Typography.labelSmall,
    color: Colors.accentDark,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  cardTitulo: { fontSize: 17, fontWeight: '700', color: Colors.dark },
  campo: { gap: Spacing.sm },
  labelCampo: { fontSize: 13, fontWeight: '600', color: Colors.darkGray },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.light,
    borderRadius: BorderRadius.large,
    borderWidth: 1.5, borderColor: Colors.border,
    paddingHorizontal: Spacing.md, gap: Spacing.sm,
  },
  inputFocused:  { borderColor: Colors.primary, backgroundColor: Colors.white },
  inputError:    { borderColor: Colors.danger, backgroundColor: '#FEF2F2' },
  input:         { flex: 1, paddingVertical: Spacing.lg, fontSize: 15, color: Colors.dark },
  togglePassword:{ padding: Spacing.sm },
  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: '#FEF2F2',
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
    borderLeftWidth: 4, borderLeftColor: Colors.danger,
  },
  errorTexto: { color: Colors.danger, fontSize: 13, fontWeight: '500', flex: 1 },
  botonLogin: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.large,
    paddingVertical: Spacing.lg,
    alignItems: 'center', justifyContent: 'center',
    marginTop: Spacing.sm,
    ...Shadows.medium,
  },
  botonLoginDeshabilitado: { opacity: 0.7 },
  botonLoginInner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  botonLoginTexto: { color: Colors.white, fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  footerWrap: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: Spacing.xs,
    marginTop: Spacing.xl,
  },
  footer: { color: 'rgba(255,255,255,0.5)', fontSize: 12 },
});
