import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useAuth } from './AuthContext';
import { obtenerMisAlertasClinicas } from '../services/alertasClinicas';
import { desactivarDispositivoPush, registrarDispositivoPush } from '../services/dispositivosPush';
import {
  buildPushDevicePayloadAsync,
  getStoredPushTokenAsync,
  requestExpoPushTokenAsync,
} from '../services/pushNotifications';
import type { AlertaClinicaResumenDto } from '../services/alertasClinicas.types';

interface AlertasClinicasContextValue {
  unreadCount: number;
  loading: boolean;
  syncInProgress: boolean;
  bootstrapReady: boolean;
  connectionError: string | null;
  pushRegistrationError: string | null;
  lastSyncAt: string | null;
  refreshNow: () => Promise<void>;
  markAlertUpdated: (alertaId: number, changes: Partial<AlertaClinicaResumenDto>) => void;
}

const AlertasClinicasContext = createContext<AlertasClinicasContextValue | null>(null);

export function AlertasClinicasProvider({ children }: { children: React.ReactNode }) {
  const { estaAutenticado, usuario, cargando } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [bootstrapReady, setBootstrapReady] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [pushRegistrationError, setPushRegistrationError] = useState<string | null>(null);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);

  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const syncRef = useRef(false);

  const resetState = useCallback(() => {
    setUnreadCount(0);
    setLoading(false);
    setSyncInProgress(false);
    setBootstrapReady(false);
    setConnectionError(null);
    setPushRegistrationError(null);
    setLastSyncAt(null);
    syncRef.current = false;
  }, []);

  const syncUnreadCount = useCallback(async () => {
    if (!estaAutenticado || !usuario || syncRef.current) return;

    syncRef.current = true;
    setSyncInProgress(true);

    try {
      const respuesta = await obtenerMisAlertasClinicas({ soloNoResueltas: true });

      if (!respuesta.success || !respuesta.data) {
        setConnectionError(respuesta.error ?? 'No se pudieron sincronizar las alertas clínicas.');
        return;
      }

      setUnreadCount(respuesta.data.filter((item) => !item.leida).length);
      setConnectionError(null);
      setLastSyncAt(new Date().toISOString());
    } finally {
      syncRef.current = false;
      setSyncInProgress(false);
      setBootstrapReady(true);
    }
  }, [estaAutenticado, usuario]);

  const registrarPushEnBackend = useCallback(async () => {
    if (!estaAutenticado || !usuario) return;

    const registro = await requestExpoPushTokenAsync();

    if (!registro.success || !registro.token) {
      setPushRegistrationError(registro.error ?? 'No se pudo habilitar el canal push.');

      if (!registro.permisosOtorgados || registro.shouldDeactivateStoredToken) {
        const storedToken = await getStoredPushTokenAsync();
        if (storedToken) {
          const motivoDesactivacion = registro.shouldDeactivateStoredToken
            ? 'Token desactivado porque la app se abrio en Expo Go.'
            : 'Permisos de notificaciones no concedidos.';

          await desactivarDispositivoPush(storedToken, motivoDesactivacion);
        }
      }
      return;
    }

    const respuesta = await registrarDispositivoPush(
      await buildPushDevicePayloadAsync(registro.token, registro.permisosOtorgados)
    );

    if (!respuesta.success) {
      setPushRegistrationError(
        respuesta.error ?? 'No se pudo registrar el dispositivo en el backend.'
      );
      return;
    }

    setPushRegistrationError(null);
  }, [estaAutenticado, usuario]);

  const bootstrap = useCallback(async () => {
    if (!estaAutenticado || !usuario) {
      resetState();
      return;
    }

    setLoading(true);
    await registrarPushEnBackend();
    await syncUnreadCount();
    setLoading(false);
    setBootstrapReady(true);
  }, [estaAutenticado, registrarPushEnBackend, resetState, syncUnreadCount, usuario]);

  useEffect(() => {
    if (cargando) return;
    void bootstrap();
  }, [bootstrap, cargando]);

  useEffect(() => {
    if (!estaAutenticado) return;

    const receivedSubscription = Notifications.addNotificationReceivedListener(() => {
      void syncUnreadCount();
    });

    return () => {
      receivedSubscription.remove();
    };
  }, [estaAutenticado, syncUnreadCount]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      appStateRef.current = nextState;

      if (nextState === 'active' && estaAutenticado && bootstrapReady) {
        void syncUnreadCount();
      }
    });

    return () => subscription.remove();
  }, [bootstrapReady, estaAutenticado, syncUnreadCount]);

  const refreshNow = useCallback(async () => {
    await syncUnreadCount();
  }, [syncUnreadCount]);

  const markAlertUpdated = useCallback((alertaId: number, changes: Partial<AlertaClinicaResumenDto>) => {
    if (changes.leida === true) {
      setUnreadCount((current) => Math.max(0, current - 1));
    }

    if (changes.leida === true || changes.resuelta === true) {
      setLastSyncAt(new Date().toISOString());
    }
  }, []);

  const value = useMemo<AlertasClinicasContextValue>(() => ({
    unreadCount,
    loading,
    syncInProgress,
    bootstrapReady,
    connectionError,
    pushRegistrationError,
    lastSyncAt,
    refreshNow,
    markAlertUpdated,
  }), [
    unreadCount,
    loading,
    syncInProgress,
    bootstrapReady,
    connectionError,
    pushRegistrationError,
    lastSyncAt,
    refreshNow,
    markAlertUpdated,
  ]);

  return (
    <AlertasClinicasContext.Provider value={value}>
      {children}
    </AlertasClinicasContext.Provider>
  );
}

export function useAlertasClinicasCenter() {
  const context = useContext(AlertasClinicasContext);
  if (!context) {
    throw new Error('useAlertasClinicasCenter debe usarse dentro de <AlertasClinicasProvider>.');
  }
  return context;
}
