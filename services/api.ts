import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError, AxiosInstance, isAxiosError } from "axios";
import {
  ApiResponse,
  BusquedaResultadoDto,
  CambiarPasswordDTO,
  CasoClinicoResumenDto,
  CasoClinicoUsuarioDto,
  CategoriaDto,
  EstadisticasUsuarioDto,
  LoginRequestDTO,
  LoginResponseDTO,
  RespuestaResultadoDto,
  RespuestaUsuarioCreateDto,
  SugerenciaHallazgoDto,
  UsuarioResponseDTO,
} from "./api.types";

// ============================================
// URL DE LA API (fija — producción)
// ============================================

export const STORAGE_API_URL = "@guias_api_url";
const DEFAULT_API_URL = "https://guias-clinicas-api.onrender.com/api";

let _apiBaseUrl: string = DEFAULT_API_URL;
let _onUnauthorized: (() => void) | null = null;

// La URL es fija; la app siempre usa la API de producción.
export const initApiUrl = async (): Promise<void> => {
  _apiBaseUrl = DEFAULT_API_URL;
};

export const setApiBaseUrl = async (url: string): Promise<void> => {
  const clean = url.trim().replace(/\/$/, "");
  _apiBaseUrl = clean;
  api.defaults.baseURL = clean;
  await AsyncStorage.setItem(STORAGE_API_URL, clean);
};

export const getApiBaseUrl = (): string => _apiBaseUrl;

export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  _onUnauthorized = handler;
};

// ============================================
// INSTANCIA AXIOS
// ============================================

const api: AxiosInstance = axios.create({
  baseURL: DEFAULT_API_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  config.baseURL = _apiBaseUrl;
  if (_token) config.headers["Authorization"] = `Bearer ${_token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError(error) && error.response?.status === 401) {
      _onUnauthorized?.();
    }

    return Promise.reject(error);
  }
);

// ============================================
// TOKEN JWT
// ============================================

let _token: string | null = null;

export const setAuthToken = (token: string | null) => {
  _token = token;
};

// ============================================
// AUTENTICACIÓN
// ============================================

export const login = async (
  dto: LoginRequestDTO,
): Promise<ApiResponse<LoginResponseDTO>> => {
  try {
    const response = await api.post<LoginResponseDTO>("/Auth/login", dto);
    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
};

// ============================================
// PERFIL DE USUARIO
// ============================================

export const obtenerMiPerfil = async (): Promise<
  ApiResponse<UsuarioResponseDTO>
> => {
  try {
    const response = await api.get<UsuarioResponseDTO>("/Usuarios/me");
    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const cambiarPassword = async (
  id: number,
  dto: CambiarPasswordDTO,
): Promise<ApiResponse<void>> => {
  try {
    await api.put(`/Usuarios/${id}/cambiar-password`, dto);
    return { success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

// ============================================
// BUSCADOR
// ============================================

export const buscarHallazgoUnico = async (
  termino: string,
): Promise<ApiResponse<BusquedaResultadoDto>> => {
  try {
    const response = await api.get<BusquedaResultadoDto>("/Buscador/buscar", {
      params: { termino },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const buscarHallazgosMultiples = async (
  termino: string,
  limite: number = 5,
): Promise<ApiResponse<BusquedaResultadoDto[]>> => {
  try {
    const response = await api.get<BusquedaResultadoDto[]>(
      "/Buscador/buscar-multiples",
      {
        params: { termino, limite },
      },
    );
    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const obtenerSugerenciasEnTiempoReal = async (
  terminoParcial: string,
  limite: number = 10,
): Promise<ApiResponse<SugerenciaHallazgoDto[]>> => {
  try {
    if (!terminoParcial || terminoParcial.length < 2)
      return { success: true, data: [] };
    const response = await api.get<SugerenciaHallazgoDto[]>(
      "/Buscador/sugerencias",
      {
        params: { termino: terminoParcial, limite },
      },
    );
    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
};

// ============================================
// CATEGORÍAS
// ============================================

export const obtenerCategorias = async (): Promise<
  ApiResponse<CategoriaDto[]>
> => {
  try {
    const response = await api.get<CategoriaDto[]>("/Categorias");
    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
};

// ============================================
// CASOS CLÍNICOS
// ============================================

export const obtenerCasosClinicos = async (params: {
  categoriaId?: number;
  dificultad?: string;
}): Promise<ApiResponse<CasoClinicoResumenDto[]>> => {
  try {
    const response = await api.get<CasoClinicoResumenDto[]>("/CasosClinicos", {
      params,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const obtenerCasoClinico = async (
  id: number,
): Promise<ApiResponse<CasoClinicoUsuarioDto> & { yaRespondido?: boolean }> => {
  try {
    const response = await api.get<CasoClinicoUsuarioDto>(
      `/CasosClinicos/${id}`,
    );
    return { success: true, data: response.data };
  } catch (error) {
    // 409 = ya respondió este caso
    if (isAxiosError(error) && error.response?.status === 409) {
      return {
        success: false,
        error: "Ya respondiste este caso.",
        yaRespondido: true,
      };
    }
    return handleApiError(error);
  }
};

export const responderCasoClinico = async (
  dto: RespuestaUsuarioCreateDto,
): Promise<ApiResponse<RespuestaResultadoDto>> => {
  try {
    const response = await api.post<RespuestaResultadoDto>(
      "/RespuestasUsuario",
      dto,
    );
    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const obtenerMisEstadisticas = async (): Promise<
  ApiResponse<EstadisticasUsuarioDto>
> => {
  try {
    const response = await api.get<EstadisticasUsuarioDto>(
      "/RespuestasUsuario/mis-estadisticas",
    );
    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
};

// ============================================
// MANEJO DE ERRORES
// ============================================

const handleApiError = (error: unknown): ApiResponse<never> => {
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError<{
      message?: string;
      error?: string;
      mensaje?: string;
    }>;

    if (axiosError.response) {
      if (axiosError.response.status === 401)
        return { success: false, error: "Credenciales inválidas." };

      const errorMessage =
        axiosError.response.data?.mensaje ||
        axiosError.response.data?.message ||
        axiosError.response.data?.error ||
        `Error del servidor: ${axiosError.response.status}`;

      return { success: false, error: errorMessage };
    }

    if (axiosError.request)
      return {
        success: false,
        error:
          "No se pudo conectar con el servidor. Verifica tu conexión a internet.",
      };
  }

  return {
    success: false,
    error: error instanceof Error ? error.message : "Error desconocido",
  };
};

export default api;
