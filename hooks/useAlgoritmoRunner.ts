import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { obtenerAlgoritmoClinico } from '../services/algoritmos';
import type { AlgorithmRuntimeSnapshot } from '../utils/algoritmos/engine';
import { AlgorithmRuntime } from '../utils/algoritmos/engine';
import type { DefinicionAlgoritmoDto } from '../services/algoritmos.types';

export function useAlgoritmoRunner(algoritmoId: number | null) {
  const runtimeRef = useRef<AlgorithmRuntime | null>(null);

  const [definition, setDefinition] = useState<DefinicionAlgoritmoDto | null>(null);
  const [snapshot, setSnapshot] = useState<AlgorithmRuntimeSnapshot | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!algoritmoId) {
      setDefinition(null);
      setSnapshot(null);
      setError('Algoritmo no válido.');
      setCargando(false);
      return;
    }

    setCargando(true);
    setError(null);

    const respuesta = await obtenerAlgoritmoClinico(algoritmoId);
    if (!respuesta.success || !respuesta.data) {
      runtimeRef.current = null;
      setDefinition(null);
      setSnapshot(null);
      setError(respuesta.error ?? 'No se pudo cargar el algoritmo.');
      setCargando(false);
      return;
    }

    const runtime = new AlgorithmRuntime(respuesta.data);
    runtimeRef.current = runtime;

    setDefinition(respuesta.data);
    setSnapshot(runtime.reset());
    setCargando(false);
  }, [algoritmoId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const enviarRespuesta = useCallback((answer?: unknown) => {
    if (!runtimeRef.current) return;
    setSnapshot(runtimeRef.current.submit(answer));
  }, []);

  const retroceder = useCallback(() => {
    if (!runtimeRef.current) return;
    setSnapshot(runtimeRef.current.goBack());
  }, []);

  const reiniciar = useCallback(() => {
    if (!runtimeRef.current) return;
    setSnapshot(runtimeRef.current.reset());
  }, []);

  return useMemo(() => ({
    cargando,
    currentNode: snapshot?.currentNode ?? null,
    definition,
    error,
    context: snapshot?.context ?? {},
    responses: snapshot?.responses ?? {},
    canGoBack: snapshot?.canGoBack ?? false,
    isTerminal: snapshot?.isTerminal ?? false,
    enviarRespuesta,
    recargar: cargar,
    reiniciar,
    retroceder,
  }), [
    cargando,
    snapshot,
    definition,
    error,
    enviarRespuesta,
    cargar,
    reiniciar,
    retroceder,
  ]);
}
