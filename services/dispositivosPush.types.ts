export interface RegistrarDispositivoPushRequestDto {
  token: string;
  plataforma: string;
  proveedor?: string | null;
  dispositivoId?: string | null;
  nombreDispositivo?: string | null;
  modelo?: string | null;
  sistemaOperativo?: string | null;
  appVersion?: string | null;
  ambiente?: string | null;
  permisosOtorgados: boolean;
}

export interface DesactivarDispositivoPushRequestDto {
  token: string;
  motivo?: string | null;
}

export interface DispositivoPushDto {
  id: number;
  token: string;
  plataforma: string;
  proveedor: string;
  dispositivoId?: string | null;
  nombreDispositivo?: string | null;
  modelo?: string | null;
  sistemaOperativo?: string | null;
  appVersion?: string | null;
  ambiente: string;
  permisosOtorgados: boolean;
  activo: boolean;
  fechaRegistro: string;
  ultimoRegistro: string;
  ultimoEnvioExitoso?: string | null;
  ultimoError?: string | null;
}
