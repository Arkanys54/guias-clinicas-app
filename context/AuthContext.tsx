import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { initApiUrl, login as apiLogin, setAuthToken } from '../services/api';
import { desactivarDispositivoPush } from '../services/dispositivosPush';
import { LoginRequestDTO, UsuarioResponseDTO } from '../services/api.types';
import { getStoredPushTokenAsync } from '../services/pushNotifications';
import {
  clearStoredAuthSession,
  loadStoredAuthSession,
  storeAuthSession,
} from '../services/authSessionStorage';

// ============================================
// TIPOS
// ============================================

interface AuthState {
  token: string | null;
  usuario: UsuarioResponseDTO | null;
  cargando: boolean;         // true mientras verifica AsyncStorage al iniciar
}

interface AuthContextValue extends AuthState {
  iniciarSesion: (dto: LoginRequestDTO) => Promise<{ success: boolean; error?: string; usuario?: UsuarioResponseDTO }>;
  cerrarSesion: () => Promise<void>;
  estaAutenticado: boolean;
}

// ============================================
// CONTEXTO
// ============================================

const AuthContext = createContext<AuthContextValue | null>(null);

// ============================================
// PROVIDER
// ============================================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token:    null,
    usuario:  null,
    cargando: true,   // arranca en true hasta que leamos AsyncStorage
  });

  // ── Al montar: recuperar sesión guardada ─────────────────────────────────
  useEffect(() => {
    const cargarSesion = async () => {
      try {
        await initApiUrl();

        const sesion = await loadStoredAuthSession();

        if (!sesion) {
          setState((prev) => ({ ...prev, cargando: false }));
          return;
        }

        // Inyectar el token en axios para que todos los requests lo usen
        setAuthToken(sesion.token);

        setState({
          token: sesion.token,
          usuario: sesion.usuario,
          cargando: false,
        });
      } catch {
        // Si falla la lectura, arrancar sin sesión
        setState((prev) => ({ ...prev, cargando: false }));
      }
    };

    cargarSesion();
  }, []);

  // ── Login ────────────────────────────────────────────────────────────────
  const iniciarSesion = useCallback(
    async (dto: LoginRequestDTO): Promise<{ success: boolean; error?: string; usuario?: UsuarioResponseDTO }> => {
      const respuesta = await apiLogin(dto);

      if (!respuesta.success || !respuesta.data) {
        return { success: false, error: respuesta.error ?? 'Error al iniciar sesión.' };
      }

      const { token, usuario } = respuesta.data;

      // Guardar sesión persistente
      await storeAuthSession(token, usuario);

      // Inyectar token en axios
      setAuthToken(token);

      setState({ token, usuario, cargando: false });

      return { success: true, usuario };
    },
    []
  );

  // ── Logout ───────────────────────────────────────────────────────────────
  const cerrarSesion = useCallback(async () => {
    try {
      const pushToken = await getStoredPushTokenAsync();
      if (pushToken) {
        await desactivarDispositivoPush(pushToken, 'Cierre de sesión en la app.');
      }
    } catch {
      // no-op
    }

    await clearStoredAuthSession();

    // Quitar token de axios
    setAuthToken(null);

    setState({ token: null, usuario: null, cargando: false });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        estaAutenticado: !!state.token && !!state.usuario,
        iniciarSesion,
        cerrarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ============================================
// HOOK
// ============================================

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
