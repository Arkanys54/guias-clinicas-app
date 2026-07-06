import { AxiosError, isAxiosError } from 'axios';
import type { ApiResponse } from './api.types';
import api from './api';
import type {
  DesactivarDispositivoPushRequestDto,
  DispositivoPushDto,
  RegistrarDispositivoPushRequestDto,
} from './dispositivosPush.types';

export const registrarDispositivoPush = async (
  dto: RegistrarDispositivoPushRequestDto
): Promise<ApiResponse<DispositivoPushDto>> => {
  try {
    const response = await api.post<DispositivoPushDto>('/DispositivosPush/registrar', dto);
    return { success: true, data: response.data };
  } catch (error) {
    return manejarErrorApi(error, 'No se pudo registrar el dispositivo para notificaciones.');
  }
};

export const desactivarDispositivoPush = async (
  token: string,
  motivo?: string | null
): Promise<ApiResponse<void>> => {
  try {
    const payload: DesactivarDispositivoPushRequestDto = {
      token,
      motivo: motivo ?? null,
    };

    await api.post('/DispositivosPush/desactivar-token', payload);
    return { success: true };
  } catch (error) {
    return manejarErrorApi(error, 'No se pudo desactivar el dispositivo push.');
  }
};

const manejarErrorApi = <T>(error: unknown, mensajeBase: string): ApiResponse<T> => {
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; error?: string; mensaje?: string }>;

    if (axiosError.response) {
      if (axiosError.response.status === 401) {
        return { success: false, error: 'Tu sesión expiró. Inicia sesión nuevamente.' };
      }

      return {
        success: false,
        error:
          axiosError.response.data?.mensaje ||
          axiosError.response.data?.message ||
          axiosError.response.data?.error ||
          `${mensajeBase} (${axiosError.response.status})`,
      };
    }

    if (axiosError.request) {
      return {
        success: false,
        error: 'No se pudo conectar con el servidor de notificaciones push.',
      };
    }
  }

  return {
    success: false,
    error: error instanceof Error ? error.message : mensajeBase,
  };
};