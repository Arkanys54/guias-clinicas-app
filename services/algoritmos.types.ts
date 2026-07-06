export interface AlgoritmoClinicoCatalogoDto {
  id: number;
  versionId: number;
  clave: string;
  nombre: string;
  descripcion: string | null;
  categoriaId: number;
  categoriaNombre: string | null;
  categoriaClave: string | null;
  versionClave: string;
  numeroVersion: number;
  evidenciaRef: string | null;
  icono: string | null;
}

export interface VariableInicialContextoDto {
  nombre: string;
  tipo: string;
  valor: string;
}

export interface PosicionNodoDto {
  x: number;
  y: number;
}

export interface AccionNodoDto {
  etiqueta: string;
  accion: "next" | "restart" | "finish";
  nodoDestinoClave: string;
}

export interface OpcionNodoDefinicionDto {
  valor: string;
  etiqueta: string;
  descripcion?: string | null;
  icono?: string | null;
  color?: string | null;
  orden?: number;
  puntosAsignados?: number | null;
  nodoDestinoClave: string;
}

export interface PredicadoCondicionDto {
  kind: "predicate";
  operacion: string;
  nodoClave: string;
  variableContexto: string;
  valor: string;
  valores: string[];
  valorNumerico: number | null;
  valorBooleano: boolean | null;
  valorFecha: string | null;
}

export interface GrupoCondicionDto {
  kind: "group";
  operador: "and" | "or" | "not";
  condiciones: CondicionDto[];
}

export type CondicionDto = PredicadoCondicionDto | GrupoCondicionDto;

export interface BloqueContenidoDefinicionDto {
  tipo: string;
  titulo?: string | null;
  contenido: string;
  condicion?: CondicionDto | null;
  orden: number;
  icono?: string | null;
  colorFondo?: string | null;
}

export interface NodoBaseDefinicionDto {
  type: string;
  clave: string;
  nombre: string;
  descripcion?: string | null;
  icono?: string | null;
  color?: string | null;
  ordenVisual?: number | null;
  posicion?: PosicionNodoDto | null;
  esTerminal: boolean;
}

export interface NodoSingleChoiceDefinicionDto extends NodoBaseDefinicionDto {
  type: "single_choice";
  tituloPregunta: string;
  textoAyuda?: string | null;
  etiquetaBotonContinuar?: string | null;
  opciones: OpcionNodoDefinicionDto[];
}

export interface NodoMultiChoiceDefinicionDto extends NodoBaseDefinicionDto {
  type: "multi_choice";
  tituloPregunta: string;
  textoAyuda?: string | null;
  permiteSinSeleccion: boolean;
  minSelecciones?: number;
  maxSelecciones?: number | null;
  etiquetaBotonContinuar?: string | null;
  nodoSiguienteClave: string;
  opciones: OpcionNodoDefinicionDto[];
}

export interface NodoNumericInputDefinicionDto extends NodoBaseDefinicionDto {
  type: "numeric_input";
  tituloPregunta: string;
  placeholder?: string | null;
  unidad?: string | null;
  minimo?: number | null;
  maximo?: number | null;
  paso?: number | null;
  requerido: boolean;
  etiquetaBotonContinuar?: string | null;
  nodoSiguienteClave: string;
}

export interface NodoDateInputDefinicionDto extends NodoBaseDefinicionDto {
  type: "date_input";
  tituloPregunta: string;
  placeholder?: string | null;
  requerido: boolean;
  etiquetaBotonContinuar?: string | null;
  nodoSiguienteClave: string;
}

export interface NodoBooleanDefinicionDto extends NodoBaseDefinicionDto {
  type: "boolean";
  tituloPregunta: string;
  textoAyuda?: string | null;
  etiquetaVerdadero?: string | null;
  etiquetaFalso?: string | null;
  valorVerdadero?: string | null;
  valorFalso?: string | null;
  nodoDestinoVerdaderoClave: string;
  nodoDestinoFalsoClave: string;
  etiquetaBotonContinuar?: string | null;
}

export interface NodoTextInputDefinicionDto extends NodoBaseDefinicionDto {
  type: "text_input";
  tituloPregunta: string;
  placeholder?: string | null;
  requerido: boolean;
  maxLength?: number | null;
  etiquetaBotonContinuar?: string | null;
  nodoSiguienteClave: string;
}

export interface AsignacionContextoDefinicionDto {
  nombreVariable: string;
  tipo: string;
  operacion: string;
  valor: string;
  condicion?: CondicionDto | null;
  descripcion?: string | null;
  orden?: number;
}

export interface ReglaDecisionDefinicionDto {
  prioridad: number;
  condicion: CondicionDto;
  nodoDestinoClave: string;
  descripcion?: string | null;
}

export interface NodoComputedDefinicionDto extends NodoBaseDefinicionDto {
  type: "computed";
  asignaciones: AsignacionContextoDefinicionDto[];
  nodoSiguienteClave: string;
}

export interface NodoDecisionDefinicionDto extends NodoBaseDefinicionDto {
  type: "decision";
  reglas: ReglaDecisionDefinicionDto[];
  nodoDestinoPorDefectoClave: string;
}

export interface NodoResultDefinicionDto extends NodoBaseDefinicionDto {
  type: "result";
  titulo: string;
  subtitulo?: string | null;
  bloques: BloqueContenidoDefinicionDto[];
  accion?: AccionNodoDto | null;
}

export interface NodoInfoDefinicionDto extends NodoBaseDefinicionDto {
  type: "info";
  titulo: string;
  subtitulo?: string | null;
  bloques: BloqueContenidoDefinicionDto[];
  accion?: AccionNodoDto | null;
}

export interface NodoAlertDefinicionDto extends NodoBaseDefinicionDto {
  type: "alert";
  titulo: string;
  severidad?: string | null;
  bloques: BloqueContenidoDefinicionDto[];
  accion?: AccionNodoDto | null;
}

export type NodoAlgoritmoDefinicionDto =
  | NodoSingleChoiceDefinicionDto
  | NodoMultiChoiceDefinicionDto
  | NodoNumericInputDefinicionDto
  | NodoDateInputDefinicionDto
  | NodoBooleanDefinicionDto
  | NodoTextInputDefinicionDto
  | NodoComputedDefinicionDto
  | NodoDecisionDefinicionDto
  | NodoResultDefinicionDto
  | NodoInfoDefinicionDto
  | NodoAlertDefinicionDto;

export interface DefinicionAlgoritmoDto {
  clave: string;
  nombre: string;
  descripcion?: string | null;
  versionClave: string;
  numeroVersion: number;
  estado: string;
  categoriaClave: string;
  evidenciaRef?: string | null;
  nodoInicioClave: string;
  variablesIniciales: VariableInicialContextoDto[];
  nodos: NodoAlgoritmoDefinicionDto[];
}

export interface ResultadoBloqueVisibleDto extends BloqueContenidoDefinicionDto {
  visible: boolean;
}
