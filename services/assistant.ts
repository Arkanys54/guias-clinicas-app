import { AxiosError, isAxiosError } from 'axios';
import api from './api';
import type { ApiResponse } from './api.types';
import type {
  AssistantProviderStatusDto,
  AssistantQueryRequestDto,
  AssistantResponseDto,
  AssistantSuggestionDto,
} from './assistant.types';

export const consultarAssistant = async (
  dto: AssistantQueryRequestDto
): Promise<ApiResponse<AssistantResponseDto>> => {
  try {
    const response = await api.post<AssistantResponseDto>('/Assistant/query', dto);
    return { success: true, data: response.data };
  } catch (error) {
    return manejarErrorApi(error, 'No se pudo consultar el asistente clínico.');
  }
};

export const obtenerSugerenciasAssistant = async (
  texto: string,
  limite: number = 6
): Promise<ApiResponse<AssistantSuggestionDto[]>> => {
  try {
    if (!texto || texto.trim().length < 2) {
      return { success: true, data: [] };
    }

    const response = await api.get<AssistantSuggestionDto[]>('/Assistant/suggestions', {
      params: { texto, limite },
    });

    return { success: true, data: response.data };
  } catch (error) {
    return manejarErrorApi(error, 'No se pudieron cargar las sugerencias del asistente.');
  }
};

export const obtenerEstadoAssistantProvider = async (): Promise<ApiResponse<AssistantProviderStatusDto>> => {
  try {
    const response = await api.get<AssistantProviderStatusDto>('/Assistant/provider-status');
    return { success: true, data: response.data };
  } catch (error) {
    return manejarErrorApi(error, 'No se pudo verificar el estado del proveedor de IA.');
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
        error: 'No se pudo conectar con el servidor del asistente.',
      };
    }
  }

  return {
    success: false,
    error: error instanceof Error ? error.message : mensajeBase,
  };
};
