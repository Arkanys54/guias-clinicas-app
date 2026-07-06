import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { AlgoritmoRunnerScreen } from '../../components/algoritmos/runner/AlgoritmoRunnerScreen';

export default function AlgoritmoDetalleRoute() {
  const params = useLocalSearchParams<{ algoritmoId?: string | string[] }>();
  const rawId = Array.isArray(params.algoritmoId) ? params.algoritmoId[0] : params.algoritmoId;
  const algoritmoId = rawId ? Number(rawId) : NaN;

  return <AlgoritmoRunnerScreen algoritmoId={Number.isFinite(algoritmoId) ? algoritmoId : null} />;
}
