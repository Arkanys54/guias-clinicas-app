import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import api, { obtenerCasoClinico, responderCasoClinico } from '../services/api';
import { CasoClinicoUsuarioDto, RespuestaResultadoDto } from '../services/api.types';

export type EstadoCaso =
  | 'cargando'
  | 'error'
  | 'yaRespondido'
  | 'listo'
  | 'enviando'
  | 'resultado';

export function useCasoDetalle(id: string | undefined) {
  const scrollRef = useRef<ScrollView>(null);

  const [estado, setEstado] = useState<EstadoCaso>('cargando');
  const [caso, setCaso] = useState<CasoClinicoUsuarioDto | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [opcionId, setOpcionId] = useState<number | null>(null);
  const [resultado, setResultado] = useState<RespuestaResultadoDto | null>(null);
  const [reintentando, setReintentando] = useState(false);
  const [minutosRestantes, setMinutosRestantes] = useState<number | null>(null);

  // ── Countdown ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (estado !== 'yaRespondido' || !minutosRestantes || minutosRestantes <= 0) return;
    const intervalo = setInterval(() => {
      setMinutosRestantes((prev) => {
        if (prev === null || prev <= 1) { clearInterval(intervalo); return 0; }
        return prev - 1;
      });
    }, 60_000);
    return () => clearInterval(intervalo);
  }, [estado, minutosRestantes]);

  // ── Carga en modo reintento ─────────────────────────────────────────────────
  // Declarada antes de `cargar` para poder incluirla en sus deps
  const cargarParaReintento = useCallback(async () => {
    setEstado('cargando');
    try {
      const response = await api.get(`/CasosClinicos/${id}?reintento=true`);
      setCaso(response.data);
      setOpcionId(null);
      setReintentando(true);
      setEstado('listo');
    } catch (err: any) {
      const status = err?.response?.status;
      const body   = err?.response?.data;
      if (status === 429) {
        setMinutosRestantes(body?.minutosRestantes ?? 60);
        setEstado('yaRespondido');
      } else {
        setErrorMsg(body?.mensaje ?? 'No se pudo cargar el caso.');
        setEstado('error');
      }
    }
  }, [id]);

  // ── Carga inicial ───────────────────────────────────────────────────────────
  const cargar = useCallback(async () => {
    setEstado('cargando');
    setOpcionId(null);
    setResultado(null);
    setReintentando(false);
    setMinutosRestantes(null);
    const res = await obtenerCasoClinico(Number(id));
    if (res.success && res.data) {
      setCaso(res.data);
      setEstado('listo');
    } else if (res.yaRespondido) {
      await cargarParaReintento();
    } else {
      setErrorMsg(res.error ?? 'No se pudo cargar el caso.');
      setEstado('error');
    }
  }, [id, cargarParaReintento]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // ── Enviar respuesta ────────────────────────────────────────────────────────
  const enviarRespuesta = async () => {
    if (!opcionId || !caso) return;
    setEstado('enviando');
    try {
      let data: RespuestaResultadoDto;
      if (reintentando) {
        const response = await api.put(`/RespuestasUsuario/${caso.id}`, {
          opcionSeleccionadaId: opcionId,
        });
        data = response.data;
      } else {
        const res = await responderCasoClinico({
          casoId: caso.id,
          opcionSeleccionadaId: opcionId,
        });
        if (!res.success || !res.data) {
          setErrorMsg(res.error ?? 'Error al guardar la respuesta.');
          setEstado('error');
          return;
        }
        data = res.data;
      }
      setResultado(data);
      setEstado('resultado');
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
    } catch (err: any) {
      const status = err?.response?.status;
      const body   = err?.response?.data;
      if (status === 429) {
        setMinutosRestantes(body?.minutosRestantes ?? 60);
        setReintentando(false);
        setEstado('yaRespondido');
      } else {
        setErrorMsg(body?.mensaje ?? 'Error al guardar la respuesta.');
        setEstado('error');
      }
    }
  };

  return {
    scrollRef,
    estado,
    caso,
    errorMsg,
    opcionId,
    setOpcionId,
    resultado,
    reintentando,
    minutosRestantes,
    cargar,
    cargarParaReintento,
    enviarRespuesta,
  };
}