import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { AlertaDetalleScreen } from '../../components/alertas/AlertaDetalleScreen';

export default function AlertaDetalleRoute() {
  const params = useLocalSearchParams<{ alertaId?: string | string[] }>();
  const rawId = Array.isArray(params.alertaId) ? params.alertaId[0] : params.alertaId;
  const alertaId = rawId ? Number(rawId) : NaN;

  return <AlertaDetalleScreen alertaId={Number.isFinite(alertaId) ? alertaId : null} />;
}
