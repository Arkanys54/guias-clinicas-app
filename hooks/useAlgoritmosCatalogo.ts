import { useCallback, useEffect, useMemo, useState } from 'react';
import { obtenerAlgoritmosClinicos } from '../services/algoritmos';
import type { AlgoritmoClinicoCatalogoDto } from '../services/algoritmos.types';

export function useAlgoritmosCatalogo() {
  const [algoritmos, setAlgoritmos] = useState<AlgoritmoClinicoCatalogoDto[]>([]);
  const [categoriaActiva, setCategoriaActiva] = useState<string>('todas');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);

    const respuesta = await obtenerAlgoritmosClinicos();

    if (!respuesta.success || !respuesta.data) {
      setAlgoritmos([]);
      setError(respuesta.error ?? 'No se pudieron cargar los algoritmos.');
      setCargando(false);
      return;
    }

    setAlgoritmos(respuesta.data);
    setCargando(false);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const categorias = useMemo(() => {
    const seen = new Set<string>();
    const items = algoritmos
      .filter((algoritmo) => algoritmo.categoriaClave)
      .map((algoritmo) => ({
        clave: algoritmo.categoriaClave || 'sin-categoria',
        nombre: algoritmo.categoriaNombre || algoritmo.categoriaClave || 'Sin categoría',
      }))
      .filter((categoria) => {
        if (seen.has(categoria.clave)) return false;
        seen.add(categoria.clave);
        return true;
      })
      .sort((left, right) => left.nombre.localeCompare(right.nombre));

    return [{ clave: 'todas', nombre: 'Todas' }, ...items];
  }, [algoritmos]);

  const algoritmosFiltrados = useMemo(() => {
    if (categoriaActiva === 'todas') return algoritmos;
    return algoritmos.filter((algoritmo) => algoritmo.categoriaClave === categoriaActiva);
  }, [algoritmos, categoriaActiva]);

  return {
    algoritmos: algoritmosFiltrados,
    categoriaActiva,
    categorias,
    cargando,
    error,
    recargar: cargar,
    setCategoriaActiva,
  };
}
