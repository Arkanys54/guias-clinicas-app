import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { ExecutionEnvironment } from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { RegistrarDispositivoPushRequestDto } from './dispositivosPush.types';

export const STORED_PUSH_TOKEN_KEY = '@guias_push_token';
export const STORED_DEVICE_ID_KEY = '@guias_device_id';
export const ALERTAS_ANDROID_CHANNEL_ID = 'alertas-clinicas';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface PushTokenResult {
  success: boolean;
  token?: string;
  error?: string;
  permisosOtorgados: boolean;
  shouldDeactivateStoredToken?: boolean;
}

export async function preparePushNotificationsAsync(): Promise<void> {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync(ALERTAS_ANDROID_CHANNEL_ID, {
    name: 'Alertas clínicas',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#0C4DA2',
    sound: 'default',
  });
}

export async function requestExpoPushTokenAsync(): Promise<PushTokenResult> {
  if (isRunningInExpoGo()) {
    return {
      success: false,
      error:
        'Las notificaciones push remotas deben probarse desde la build propia de Guias Clinicas, no desde Expo Go. Usa `npm run start` y abre la app instalada.',
      permisosOtorgados: true,
      shouldDeactivateStoredToken: true,
    };
  }

  if (Platform.OS === 'android' && !isAndroidFirebaseConfigured()) {
    return {
      success: false,
      error:
        'Falta configurar Firebase Cloud Messaging en Android. Agrega `google-services.json` en la raiz de la app y reconstruye la build nativa.',
      permisosOtorgados: true,
    };
  }

  await preparePushNotificationsAsync();

  const currentPermissions = await Notifications.getPermissionsAsync();
  let finalStatus = currentPermissions.status;

  if (finalStatus !== 'granted') {
    const requestedPermissions = await Notifications.requestPermissionsAsync();
    finalStatus = requestedPermissions.status;
  }

  if (finalStatus !== 'granted') {
    return {
      success: false,
      error: 'Los permisos de notificaciones no fueron concedidos.',
      permisosOtorgados: false,
    };
  }

  const projectId = resolveExpoProjectId();
  if (!projectId) {
    return {
      success: false,
      error: 'No se encontró el projectId de Expo/EAS para registrar notificaciones push.',
      permisosOtorgados: true,
    };
  }

  try {
    const tokenResponse = await Notifications.getExpoPushTokenAsync({ projectId });
    await AsyncStorage.setItem(STORED_PUSH_TOKEN_KEY, tokenResponse.data);

    return {
      success: true,
      token: tokenResponse.data,
      permisosOtorgados: true,
    };
  } catch (error) {
    return {
      success: false,
      error: normalizePushTokenError(error),
      permisosOtorgados: true,
    };
  }
}

export async function getStoredPushTokenAsync(): Promise<string | null> {
  return AsyncStorage.getItem(STORED_PUSH_TOKEN_KEY);
}

export async function getOrCreateDeviceIdAsync(): Promise<string> {
  const stored = await AsyncStorage.getItem(STORED_DEVICE_ID_KEY);
  if (stored) return stored;
  // ID estable por instalación: plataforma + timestamp base36 + aleatoriedad
  const id = `${Platform.OS}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
  await AsyncStorage.setItem(STORED_DEVICE_ID_KEY, id);
  return id;
}

export async function buildPushDevicePayloadAsync(
  token: string,
  permisosOtorgados: boolean
): Promise<RegistrarDispositivoPushRequestDto> {
  const dispositivoId = await getOrCreateDeviceIdAsync();
  return {
    token,
    plataforma: Platform.OS,
    proveedor: 'expo',
    dispositivoId,
    nombreDispositivo: null,
    modelo: null,
    sistemaOperativo: `${Platform.OS}-${String(Platform.Version)}`,
    appVersion: Constants.expoConfig?.version ?? null,
    ambiente: __DEV__ ? 'development' : 'production',
    permisosOtorgados,
  };
}

export function extractAlertaIdFromNotificationData(data: unknown): number | null {
  if (!data || typeof data !== 'object') return null;

  const rawValue = (data as Record<string, unknown>).alertaId;
  if (typeof rawValue === 'number' && Number.isFinite(rawValue)) return rawValue;

  if (typeof rawValue === 'string') {
    const parsed = Number(rawValue);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function resolveExpoProjectId(): string | null {
  const constantsWithExtras = Constants as typeof Constants & {
    easConfig?: { projectId?: string | null };
  };

  return (
    constantsWithExtras.easConfig?.projectId ??
    Constants.expoConfig?.extra?.eas?.projectId ??
    null
  );
}

function isRunningInExpoGo(): boolean {
  return Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
}

function isAndroidFirebaseConfigured(): boolean {
  const pushNotificationsConfig = Constants.expoConfig?.extra?.pushNotifications as
    | { googleServicesConfigured?: boolean }
    | undefined;

  return pushNotificationsConfig?.googleServicesConfigured === true;
}

function normalizePushTokenError(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('Default FirebaseApp is not initialized')) {
      return 'Firebase/FCM no esta inicializado en Android. Agrega `google-services.json`, reconstruye la app nativa y reinstalala.';
    }

    return error.message;
  }

  return 'No se pudo obtener el token push de Expo.';
}
