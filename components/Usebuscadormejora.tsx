import { useCallback, useEffect, useRef, useState } from "react";
import {
  buscarHallazgosMultiples,
  buscarHallazgoUnico,
  obtenerSugerenciasEnTiempoReal,
} from "../services/api";
import { 
  BusquedaResultadoDto,
  SugerenciaHallazgoDto,
} from "../services/api.types";

interface UseBuscadorOptions {
  delayMs?: number;
  limiteSugerencias?: number;
}

export const useBuscadorMejora = (options: UseBuscadorOptions = {}) => {
  const { delayMs = 300, limiteSugerencias = 10 } = options;

  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [sugerencias, setSugerencias] = useState<SugerenciaHallazgoDto[]>([]);
  const [resultados, setResultados] = useState<BusquedaResultadoDto[]>([]);
  const [resultadoUnico, setResultadoUnico] =
    useState<BusquedaResultadoDto | null>(null);

  const [cargandoSugerencias, setCargandoSugerencias] = useState(false);
  const [cargandoResultados, setCargandoResultados] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCambioTermino = useCallback(
    (nuevoTermino: string) => {
      setTerminoBusqueda(nuevoTermino);
      setError(null);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (!nuevoTermino.trim()) {
        setSugerencias([]);
        setMostrarSugerencias(false);
        return;
      }

      setCargandoSugerencias(true);
      setMostrarSugerencias(true);

      timeoutRef.current = setTimeout(async () => {
        try {
          const respuesta = await obtenerSugerenciasEnTiempoReal(
            nuevoTermino,
            limiteSugerencias,
          );

          if (respuesta.success && respuesta.data) {
            setSugerencias(respuesta.data);
          } else {
            setError(respuesta.error || "No se encontraron sugerencias");
            setSugerencias([]);
          }
        } catch (_err) {
          setError("Error al buscar sugerencias");
          setSugerencias([]);
        } finally {
          setCargandoSugerencias(false);
        }
      }, delayMs);
    },
    [delayMs, limiteSugerencias],
  );

  const buscarUnico = useCallback(async (termino: string) => {
    if (!termino.trim()) {
      setError("Por favor ingresa un término de búsqueda");
      return;
    }

    setCargandoResultados(true);
    setError(null);
    setMostrarSugerencias(false);

    try {
      const respuesta = await buscarHallazgoUnico(termino);

      if (respuesta.success && respuesta.data) {
        setResultadoUnico(respuesta.data);
        setResultados([]);
      } else {
        setError(respuesta.error || "No se encontraron resultados");
        setResultadoUnico(null);
      }
    } catch (_err) {
      setError("Error al realizar la búsqueda");
      setResultadoUnico(null);
    } finally {
      setCargandoResultados(false);
    }
  }, []);

  const buscarMultiples = useCallback(
    async (termino: string, limite: number = 5) => {
      if (!termino.trim()) {
        setError("Por favor ingresa un término de búsqueda");
        return;
      }

      setCargandoResultados(true);
      setError(null);
      setMostrarSugerencias(false);

      try {
        const respuesta = await buscarHallazgosMultiples(termino, limite);

        if (respuesta.success && respuesta.data) {
          setResultados(respuesta.data);
          setResultadoUnico(null);
        } else {
          setError(respuesta.error || "No se encontraron resultados");
          setResultados([]);
        }
      } catch (_err) {
        setError("Error al realizar la búsqueda");
        setResultados([]);
      } finally {
        setCargandoResultados(false);
      }
    },
    [],
  );

  const seleccionarSugerencia = useCallback(
    async (sugerencia: SugerenciaHallazgoDto) => {
      setTerminoBusqueda(sugerencia.hallazgoNombre);
      setMostrarSugerencias(false);
      await buscarUnico(sugerencia.hallazgoNombre);
    },
    [buscarUnico],
  );

  const limpiarBusqueda = useCallback(() => {
    setTerminoBusqueda("");
    setSugerencias([]);
    setResultados([]);
    setResultadoUnico(null);
    setError(null);
    setMostrarSugerencias(false);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return {
    terminoBusqueda,
    sugerencias,
    resultados,
    resultadoUnico,
    cargandoSugerencias,
    cargandoResultados,
    error,
    mostrarSugerencias,
    handleCambioTermino,
    buscarUnico,
    buscarMultiples,
    seleccionarSugerencia,
    limpiarBusqueda,
    setMostrarSugerencias,
  };
};

export const useSugerenciasMovil = (
  delayMs: number = 300,
  limite: number = 10,
) => {
  const [termino, setTermino] = useState("");
  const [sugerencias, setSugerencias] = useState<SugerenciaHallazgoDto[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const actualizar = useCallback(
    (nuevoTermino: string) => {
      setTermino(nuevoTermino);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (!nuevoTermino.trim()) {
        setSugerencias([]);
        return;
      }

      setCargando(true);

      timeoutRef.current = setTimeout(async () => {
        try {
          const respuesta = await obtenerSugerenciasEnTiempoReal(
            nuevoTermino,
            limite,
          );

          if (respuesta.success) {
            setSugerencias(respuesta.data || []);
            setError(null);
          } else {
            setError(respuesta.error ?? "Error desconocido");
            setSugerencias([]);
          }
        } catch (_err) {
          setError("Error buscando sugerencias");
          setSugerencias([]);
        } finally {
          setCargando(false);
        }
      }, delayMs);
    },
    [delayMs, limite],
  );

  return { termino, sugerencias, cargando, error, actualizar };
};