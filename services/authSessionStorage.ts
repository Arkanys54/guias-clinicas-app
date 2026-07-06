import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { UsuarioResponseDTO } from './api.types';

export const STORAGE_TOKEN = '@guias_token';
export const STORAGE_USUARIO = '@guias_usuario';

type AuthSession = {
  token: string;
  usuario: UsuarioResponseDTO;
};

const usarSecureStore = Platform.OS !== 'web';

const getTokenAsync = async (): Promise<string | null> => {
  if (!usarSecureStore) {
    return AsyncStorage.getItem(STORAGE_TOKEN);
  }

  try {
    return await SecureStore.getItemAsync(STORAGE_TOKEN);
  } catch {
    return AsyncStorage.getItem(STORAGE_TOKEN);
  }
};

const setTokenAsync = async (token: string): Promise<void> => {
  if (!usarSecureStore) {
    await AsyncStorage.setItem(STORAGE_TOKEN, token);
    return;
  }

  try {
    await SecureStore.setItemAsync(STORAGE_TOKEN, token);
    await AsyncStorage.removeItem(STORAGE_TOKEN);
  } catch {
    await AsyncStorage.setItem(STORAGE_TOKEN, token);
  }
};

const removeTokenAsync = async (): Promise<void> => {
  await Promise.all([
    AsyncStorage.removeItem(STORAGE_TOKEN),
    usarSecureStore
      ? SecureStore.deleteItemAsync(STORAGE_TOKEN).catch(() => undefined)
      : Promise.resolve(),
  ]);
};

export const loadStoredAuthSession = async (): Promise<AuthSession | null> => {
  const [tokenGuardado, usuarioGuardado] = await Promise.all([
    getTokenAsync(),
    AsyncStorage.getItem(STORAGE_USUARIO),
  ]);

  if (!tokenGuardado || !usuarioGuardado) {
    return null;
  }

  try {
    const usuario = JSON.parse(usuarioGuardado) as UsuarioResponseDTO;

    // Migración silenciosa: si el token seguía en AsyncStorage, lo movemos a SecureStore.
    if (usarSecureStore) {
      await SecureStore.setItemAsync(STORAGE_TOKEN, tokenGuardado).catch(() => undefined);
      await AsyncStorage.removeItem(STORAGE_TOKEN);
    }

    return { token: tokenGuardado, usuario };
  } catch {
    await clearStoredAuthSession();
    return null;
  }
};

export const storeAuthSession = async (
  token: string,
  usuario: UsuarioResponseDTO,
): Promise<void> => {
  await Promise.all([
    setTokenAsync(token),
    AsyncStorage.setItem(STORAGE_USUARIO, JSON.stringify(usuario)),
  ]);
};

export const clearStoredAuthSession = async (): Promise<void> => {
  await Promise.all([
    removeTokenAsync(),
    AsyncStorage.removeItem(STORAGE_USUARIO),
  ]);
};
