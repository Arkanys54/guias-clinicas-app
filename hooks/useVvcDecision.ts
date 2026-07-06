import { useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import { DiagType, FactorId, Paso } from '../constants/vvcTypes';

export function useVvcDecision() {
  const scrollRef = useRef<ScrollView | null>(null);

  const [paso, setPaso]         = useState<Paso>('triage');
  const [noVVC, setNoVVC]       = useState(false);
  const [diagType, setDiagType] = useState<DiagType>(null);
  const [factores, setFactores] = useState<Set<FactorId>>(new Set());
  const [showGuias, setShowGuias] = useState(false);

  const scrollTop = () =>
    scrollRef.current?.scrollTo({ y: 0, animated: true });

  const irA = (destino: Paso) => {
    setPaso(destino);
    // Pequeño delay para que React actualice el contenido antes de scrollear
    setTimeout(scrollTop, 50);
  };

  const reiniciar = () => {
    setPaso('triage');
    setNoVVC(false);
    setDiagType(null);
    setFactores(new Set());
    setTimeout(scrollTop, 50);
  };

  const toggleFactor = (id: FactorId) =>
    setFactores((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return {
    scrollRef,
    paso, noVVC, setNoVVC, diagType, setDiagType, factores, showGuias, setShowGuias,
    irA, reiniciar, toggleFactor,
  };
}