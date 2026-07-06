import { useCallback, useEffect, useState } from 'react';
import {
  marcarAlertaClinicaLeida,
  obtenerAlertaClinica,
  resolverAlertaClinica,
} from '../services/alertasClinicas';
import type { AlertaClinicaDetalleDto } from '../services/alertasClinicas.types';
import { useAlertasClinicasCenter } from '../context/AlertasClinicasContext';

export function useAlertaClinicaDetalle(alertaId: number | null) {
  const { markAlertUpdated } = useAlertasClinicasCenter();
  const [alerta, setAlerta] = useState<AlertaClinicaDetalleDto | null>(null);
  const [cargando, setCargando] = useState(true);
  const [resolviendo, setResolviendo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!alertaId || !Number.isFinite(alertaId)) {
      setAlerta(null);
      setError('La alerta solicitada no es válida.');
      setCargando(false);
      return;
    }

    setCargando(true);
    setError(null);

    const respuesta = await obtenerAlertaClinica(alertaId);

    if (!respuesta.success || !respuesta.data) {
      setAlerta(null);
      setError(respuesta.error ?? 'No se pudo cargar el detalle de la alerta clínica.');
      setCargando(false);
      return;
    }

    setAlerta(respuesta.data);
    setCargando(false);
  }, [alertaId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  useEffect(() => {
    if (!alerta || alerta.leida) return;

    const marcar = async () => {
      const respuesta = await marcarAlertaClinicaLeida(alerta.id);
      if (respuesta.success) {
        setAlerta((current) =>
          current
            ? {
                ...current,
                leida: true,
                fechaLectura: new Date().toISOString(),
              }
            : current
        );
        markAlertUpdated(alerta.id, { leida: true, fechaLectura: new Date().toISOString() });
      }
    };

    void marcar();
  }, [alerta, markAlertUpdated]);

  const resolver = useCallback(async () => {
    if (!alerta || alerta.resuelta) return false;

    setResolviendo(true);
    const respuesta = await resolverAlertaClinica(alerta.id);
    setResolviendo(false);

    if (!respuesta.success) {
      setError(respuesta.error ?? 'No se pudo resolver la alerta clínica.');
      return false;
    }

    const now = new Date().toISOString();
    setAlerta((current) =>
      current
        ? {
            ...current,
            resuelta: true,
            leida: true,
            fechaResolucion: now,
            fechaLectura: current.fechaLectura ?? now,
          }
        : current
    );

    markAlertUpdated(alerta.id, {
      resuelta: true,
      leida: true,
      fechaResolucion: now,
      fechaLectura: alerta.fechaLectura ?? now,
    });
    return true;
  }, [alerta, markAlertUpdated]);

  return {
    alerta,
    cargando,
    resolviendo,
    error,
    recargar: cargar,
    resolver,
  };
}

