import { useCallback, useEffect, useMemo, useState } from 'react';
import { obtenerMisAlertasClinicas } from '../services/alertasClinicas';
import type { AlertaClinicaResumenDto } from '../services/alertasClinicas.types';
import { useAlertasClinicasCenter } from '../context/AlertasClinicasContext';

export type FiltroAlertasClinicas = 'todas' | 'no-leidas' | 'pendientes' | 'criticas';

export function useAlertasClinicas() {
  const { unreadCount, bootstrapReady, refreshNow } = useAlertasClinicasCenter();
  const [alertas, setAlertas] = useState<AlertaClinicaResumenDto[]>([]);
  const [filtro, setFiltro] = useState<FiltroAlertasClinicas>('pendientes');
  const [cargando, setCargando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async (mode: 'initial' | 'refresh' = 'initial') => {
    if (mode === 'refresh') setRefreshing(true);
    else setCargando(true);

    setError(null);
    const respuesta = await obtenerMisAlertasClinicas({ soloNoResueltas: false });

    if (!respuesta.success || !respuesta.data) {
      setAlertas([]);
      setError(respuesta.error ?? 'No se pudieron cargar las alertas clínicas.');
      setCargando(false);
      setRefreshing(false);
      return;
    }

    setAlertas(
      [...respuesta.data].sort((left, right) => {
        const byDate =
          new Date(right.fechaCreacion).getTime() - new Date(left.fechaCreacion).getTime();
        if (byDate !== 0) return byDate;
        return right.id - left.id;
      })
    );

    setCargando(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    if (!bootstrapReady) return;
    cargar();
  }, [bootstrapReady, cargar]);

  useEffect(() => {
    if (!bootstrapReady) return;
    cargar('refresh');
  }, [unreadCount, bootstrapReady, cargar]);

  const alertasFiltradas = useMemo(() => {
    switch (filtro) {
      case 'no-leidas':
        return alertas.filter((item) => !item.leida);
      case 'pendientes':
        return alertas.filter((item) => !item.resuelta);
      case 'criticas':
        return alertas.filter((item) => item.nivel === 'alta');
      default:
        return alertas;
    }
  }, [alertas, filtro]);

  const resumen = useMemo(() => ({
    total: alertas.length,
    noLeidas: alertas.filter((item) => !item.leida).length,
    pendientes: alertas.filter((item) => !item.resuelta).length,
    criticas: alertas.filter((item) => item.nivel === 'alta').length,
  }), [alertas]);

  const recargar = useCallback(async () => {
    await Promise.all([cargar('refresh'), refreshNow()]);
  }, [cargar, refreshNow]);

  return {
    alertas: alertasFiltradas,
    alertasRaw: alertas,
    filtro,
    setFiltro,
    resumen,
    cargando,
    refreshing,
    error,
    recargar,
    unreadCount,
  };
}

