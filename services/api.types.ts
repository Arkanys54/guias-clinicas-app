// ============================================
// TIPOS EXISTENTES (sin cambios)
// ============================================

export interface GuiaClinicaDto {
  id: number;
  titulo: string;
  descripcion: string;
  enlaceDocumento: string;
  nivelEvidencia: string;
  fechaActualizacion: string;
}

export interface RecomendacionDetalleDto {
  recomendacionId: number;
  titulo: string;
  texto: string;
  justificacion: string;
  prioridad: number;
  guiaClinica: GuiaClinicaDto;
}

export interface BusquedaResultadoDto {
  hallazgoId: number;
  hallazgoNombre: string;
  hallazgoDescripcion: string;
  relevanciaScore: number;
  recomendaciones: RecomendacionDetalleDto[];
}

export interface SugerenciaHallazgoDto {
  hallazgoId: number;
  hallazgoNombre: string;
  hallazgoDescripcionResumida: string;
  relevanciaScore: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface EstadoBusqueda {
  terminoBusqueda: string;
  sugerencias: SugerenciaHallazgoDto[];
  cargando: boolean;
  error?: string;
}

export interface EstadoResultados {
  resultados: BusquedaResultadoDto[];
  cargando: boolean;
  error?: string;
  totalResultados: number;
}

// ============================================
// AUTENTICACIÓN
// ============================================

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface UsuarioResponseDTO {
  id: number;
  empresaId: number;
  nombreEmpresa: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  activo: boolean;
  fechaRegistro: string;
  ultimoAcceso: string | null;
}

export interface LoginResponseDTO {
  token: string;
  expiracion: string;
  usuario: UsuarioResponseDTO;
}

export interface CambiarPasswordDTO {
  passwordActual: string;
  passwordNueva: string;
  confirmarPassword: string;
}

// ============================================
// CATEGORÍAS
// ============================================

export interface CategoriaDto {
  id: number;
  nombre: string;
  descripcion: string | null;
  icono: string | null;
  activa: boolean;
  totalCasos: number;
}

// ============================================
// CASOS CLÍNICOS
// ============================================

/** Tarjeta de listado — sin imagen ni opciones */
export interface CasoClinicoResumenDto {
  id: number;
  titulo: string;
  enfoque: string | null;
  dificultad: string | null;
  activo: boolean;
  fechaCreacion: string;
  categoriaNombre: string;
  tieneImagen: boolean;
  totalRespuestas: number;
}

/** Opción pública — no revela cuál es correcta */
export interface OpcionRespuestaPublicaDto {
  id: number;
  letra: string;
  texto: string;
}

/** Detalle completo para el usuario antes de responder */
export interface CasoClinicoUsuarioDto {
  id: number;
  categoriaNombre: string;
  titulo: string;
  enfoque: string | null;
  premisa: string;
  pregunta: string;
  imagenBase64: string | null;  // "data:image/jpeg;base64,..."
  imagenTipo: string | null;
  dificultad: string | null;
  opciones: OpcionRespuestaPublicaDto[];
}

/** Opción después de responder — ya muestra cuál es la correcta */
export interface OpcionRespuestaResultadoDto {
  id: number;
  letra: string;
  texto: string;
  esCorrecta: boolean;
  justificacion: string | null;
}

/** Resultado inmediato después de responder */
export interface RespuestaResultadoDto {
  respuestaId: number;
  esCorrecta: boolean;
  letraSeleccionada: string;
  letraCorrecta: string;
  justificacion: string;
  opciones: OpcionRespuestaResultadoDto[];
}

/** Payload para responder un caso */
export interface RespuestaUsuarioCreateDto {
  casoId: number;
  opcionSeleccionadaId: number;
}

/** Estadísticas globales del usuario */
export interface EstadisticasUsuarioDto {
  totalRespondidos: number;
  totalCorrectos: number;
  totalIncorrectos: number;
  porcentajeAcierto: number;
  porCategoria: EstadisticasPorCategoriaDto[];
}

export interface EstadisticasPorCategoriaDto {
  categoriaNombre: string;
  respondidos: number;
  correctos: number;
  porcentaje: number;
}