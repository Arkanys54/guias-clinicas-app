import { AxiosError, isAxiosError } from 'axios';
import api from './api';
import type { ApiResponse } from './api.types';
import type {
  AlertaClinicaDetalleDto,
  AlertaClinicaResumenDto,
} from './alertasClinicas.types';

export const obtenerMisAlertasClinicas = async (params?: {
  soloNoLeidas?: boolean;
  soloNoResueltas?: boolean;
}): Promise<ApiResponse<AlertaClinicaResumenDto[]>> => {
  try {
    const response = await api.get<AlertaClinicaResumenDto[]>('/AlertasClinicas/mias', {
      params,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return manejarErrorApi(error, 'No se pudieron cargar tus alertas clínicas.');
  }
};

export const obtenerAlertaClinica = async (
  alertaId: number
): Promise<ApiResponse<AlertaClinicaDetalleDto>> => {
  try {
    const response = await api.get<AlertaClinicaDetalleDto>(`/AlertasClinicas/${alertaId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return manejarErrorApi(error, 'No se pudo cargar el detalle de la alerta clínica.');
  }
};

export const marcarAlertaClinicaLeida = async (
  alertaId: number
): Promise<ApiResponse<void>> => {
  try {
    await api.put(`/AlertasClinicas/${alertaId}/marcar-leida`);
    return { success: true };
  } catch (error) {
    return manejarErrorApi(error, 'No se pudo marcar la alerta como leída.');
  }
};

export const resolverAlertaClinica = async (
  alertaId: number
): Promise<ApiResponse<void>> => {
  try {
    await api.put(`/AlertasClinicas/${alertaId}/resolver`);
    return { success: true };
  } catch (error) {
    return manejarErrorApi(error, 'No se pudo resolver la alerta clínica.');
  }
};

const manejarErrorApi = (error: unknown, mensajeBase: string): ApiResponse<never> => {
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
        error: 'No se pudo conectar con el servidor de alertas clínicas.',
      };
    }
  }

  return {
    success: false,
    error: error instanceof Error ? error.message : mensajeBase,
  };
};
