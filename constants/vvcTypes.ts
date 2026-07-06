import { Ionicons } from '@expo/vector-icons';

export type Paso = 'triage' | 'diagnostico' | 'factores' | 'decision' | 'cultivo';
export type DiagType = 'microscopia' | 'cultivo_pos' | 'clinico' | null;
export type FactorId =
  | 'recurrente' | 'embarazo' | 'diabetes' | 'inmunosupresion'
  | 'nonalbicans' | 'falla_azoles' | 'sintomas_persist' | 'antibioticos';
export type IoniconName = keyof typeof Ionicons.glyphMap;

export interface Factor { id: FactorId; icono: IoniconName; label: string; }
export interface Fuente { sigla: string; titulo: string; year: string; color: string; }

export const STEP_ORDER: Paso[] = ['triage', 'diagnostico', 'factores', 'decision', 'cultivo'];
export const STEP_LABELS = ['Triage', 'Dx', 'Factores', 'Decisión', 'Lab'];

export const FACTORES: Factor[] = [
  { id: 'recurrente',       icono: 'refresh-outline',  label: '≥4 episodios en los últimos 12 meses (RVVC)' },
  { id: 'embarazo',         icono: 'heart-outline',    label: 'Embarazo (cualquier trimestre)' },
  { id: 'diabetes',         icono: 'water-outline',    label: 'Diabetes mal controlada' },
  { id: 'inmunosupresion',  icono: 'shield-outline',   label: 'Inmunosupresión (VIH, quimioterapia, trasplante)' },
  { id: 'nonalbicans',      icono: 'cellular-outline', label: 'Especie no-albicans identificada (C. glabrata, C. krusei, otras)' },
  { id: 'falla_azoles',     icono: 'warning-outline',  label: 'Falla o recaída tras tratamiento azólico previo' },
  { id: 'sintomas_persist', icono: 'time-outline',     label: 'Síntomas persistentes >7-14 días pese a tratamiento' },
  { id: 'antibioticos',     icono: 'medkit-outline',   label: 'Uso frecuente o reciente de antibióticos' },
];

export const FUENTES: Fuente[] = [
  { sigla: 'CDC',   titulo: 'CDC STD Treatment Guidelines',                     year: '2021', color: '#C0392B' },
  { sigla: 'IDSA',  titulo: 'IDSA Clinical Practice Guideline for Candidiasis', year: '2016', color: '#16A085' },
  { sigla: 'AWMF',  titulo: 'AWMF S2k Leitlinie Vulvovaginale Kandidose',       year: '2021', color: '#8E44AD' },
  { sigla: 'IUSTI', titulo: 'IUSTI/WHO European STI Guidelines - VVC',          year: '2022', color: '#D97706' },
];

export const isComplicada = (f: Set<FactorId>): boolean =>
  (['recurrente', 'embarazo', 'inmunosupresion', 'nonalbicans', 'falla_azoles', 'sintomas_persist'] as FactorId[])
    .some((id) => f.has(id));