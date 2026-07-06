export type AssistantIntentType = 'search' | 'navigate' | 'explain';

export type AssistantActionType =
  | 'open_algorithm'
  | 'open_algorithms_catalog'
  | 'open_search'
  | 'explain_current_node';

export interface AssistantCitationDto {
  tipoFuente: string;
  idFuente?: number | null;
  titulo: string;
  descripcion: string;
  referencia: string;
  evidencia?: string | null;
  prioridad: number;
}

export interface AssistantActionDto {
  type: AssistantActionType | string;
  label: string;
  algorithmId?: number | null;
  versionId?: number | null;
  algorithmKey?: string | null;
  nodoClave?: string | null;
  searchTerm?: string | null;
  route?: string | null;
}

export interface AssistantNodeContextDto {
  algoritmoId: number;
  algoritmoNombre: string;
  nodoClave: string;
  nodoTipo: string;
  tituloVisible: string;
  resumen: string;
}

export interface AssistantResponseDto {
  mensajeUsuario: string;
  intent: AssistantIntentType;
  message: string;
  provider: string;
  model?: string | null;
  fueGeneradoPorLlm: boolean;
  tieneContexto: boolean;
  citations: AssistantCitationDto[];
  actions: AssistantActionDto[];
  advertencias: string[];
  nodeContext?: AssistantNodeContextDto | null;
}

export interface AssistantSuggestionDto {
  tipo: string;
  texto: string;
  descripcion: string;
  algoritmoId?: number | null;
  nodoClave?: string | null;
  valor?: string | null;
}

export interface AssistantProviderStatusDto {
  provider: string;
  model?: string | null;
  habilitado: boolean;
  configurado: boolean;
  modoOperacion: string;
}

export interface AssistantQueryRequestDto {
  mensaje: string;
  algoritmoId?: number;
  nodoClave?: string;
  categoriaClave?: string;
  limiteContexto?: number;
}

export interface AssistantMessageItem {
  id: string;
  role: 'assistant' | 'user' | 'system';
  text: string;
  createdAt: string;
  response?: AssistantResponseDto;
  pending?: boolean;
  error?: boolean;
}
