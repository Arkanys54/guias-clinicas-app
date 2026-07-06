import type { RecomendacionDetalleDto } from './api.types';

export interface EventoClinicoResumenDto {
  id: number;
  pacienteId: number;
  pacienteNombre: string;
  medicoId: number;
  medicoNombre: string;
  tipoEvento: string;
  subtipo?: string | null;
  valorPrincipal: string;
  unidad?: string | null;
  origen: string;
  estado: string;
  esCritico: boolean;
  procesado: boolean;
  fechaEvento: string;
  fechaCreacion: string;
  alertasGeneradas: number;
  hallazgoClave?: string | null;
  terminoInterpretado?: string | null;
}

export interface AlertaClinicaResumenDto {
  id: number;
  eventoClinicoId: number;
  pacienteId: number;
  pacienteNombre: string;
  medicoId: number;
  medicoNombre: string;
  tipoAlerta: string;
  titulo: string;
  mensaje: string;
  nivel: string;
  leida: boolean;
  resuelta: boolean;
  fechaCreacion: string;
  fechaLectura?: string | null;
  fechaResolucion?: string | null;
  resumenRecomendaciones?: string | null;
  hallazgoClave?: string | null;
  algoritmoSugeridoId?: number | null;
  algoritmoSugeridoNombre?: string | null;
}

export interface AlertaClinicaDetalleDto extends AlertaClinicaResumenDto {
  eventoClinico?: EventoClinicoResumenDto | null;
  recomendaciones: RecomendacionDetalleDto[];
  datosAccionJson?: string | null;
  terminoInterpretado?: string | null;
}
