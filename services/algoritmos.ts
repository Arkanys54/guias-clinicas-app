import { AxiosError, isAxiosError } from 'axios';
import api from './api';
import type { ApiResponse } from './api.types';
import type { AlgoritmoClinicoCatalogoDto, DefinicionAlgoritmoDto } from './algoritmos.types';

export const obtenerAlgoritmosClinicos = async (
  categoriaClave?: string
): Promise<ApiResponse<AlgoritmoClinicoCatalogoDto[]>> => {
  try {
    const response = await api.get<AlgoritmoClinicoCatalogoDto[]>('/AlgoritmosClinicos', {
      params: categoriaClave ? { categoriaClave } : undefined,
    });

    return { success: true, data: response.data };
  } catch (error) {
    return manejarErrorApi(error);
  }
};

export const obtenerAlgoritmoClinico = async (
  algoritmoId: number
): Promise<ApiResponse<DefinicionAlgoritmoDto>> => {
  try {
    const response = await api.get<DefinicionAlgoritmoDto>(`/AlgoritmosClinicos/${algoritmoId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return manejarErrorApi(error);
  }
};

const manejarErrorApi = (error: unknown): ApiResponse<never> => {
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
          `Error del servidor: ${axiosError.response.status}`,
      };
    }

    if (axiosError.request) {
      return {
        success: false,
        error: 'No se pudo conectar con el servidor para cargar los algoritmos.',
      };
    }
  }

  return {
    success: false,
    error: error instanceof Error ? error.message : 'Error desconocido',
  };
};
