import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  consultarAssistant,
  obtenerEstadoAssistantProvider,
} from '../services/assistant';
import type {
  AssistantActionDto,
  AssistantMessageItem,
  AssistantProviderStatusDto,
} from '../services/assistant.types';

const QUICK_PROMPTS = [
  '¿Qué algoritmo me recomiendas para candidemia?',
  'Explícame este paso del algoritmo actual',
  'Busca recomendaciones para hemocultivo positivo',
  'Llévame al catálogo de algoritmos',
];

const buildMessage = (
  partial: Partial<AssistantMessageItem> & Pick<AssistantMessageItem, 'role' | 'text'>
): AssistantMessageItem => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  createdAt: new Date().toISOString(),
  ...partial,
});

export function useAssistantChat() {
  const [messages, setMessages] = useState<AssistantMessageItem[]>([
    buildMessage({
      role: 'assistant',
      text:
        'Puedo ayudarte a buscar hallazgos, explicar pasos de un algoritmo y llevarte directo a un flujo clínico publicado.',
    }),
  ]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [providerStatus, setProviderStatus] = useState<AssistantProviderStatusDto | null>(null);

  const loadProviderStatus = useCallback(async () => {
    const respuesta = await obtenerEstadoAssistantProvider();
    if (respuesta.success && respuesta.data) {
      setProviderStatus(respuesta.data);
    }
  }, []);

  useEffect(() => {
    loadProviderStatus();
  }, [loadProviderStatus]);

  const sendMessage = useCallback(async (text: string) => {
    const mensaje = text.trim();
    if (!mensaje || loading) return null;

    setLoading(true);
    setError(null);

    const userMessage = buildMessage({ role: 'user', text: mensaje });
    const pendingMessage = buildMessage({
      role: 'assistant',
      text: 'Analizando contexto clínico...',
      pending: true,
    });

    setMessages((current) => [...current, userMessage, pendingMessage]);
    setDraft('');

    const respuesta = await consultarAssistant({ mensaje, limiteContexto: 6 });

    setMessages((current) => current.filter((item) => item.id !== pendingMessage.id));

    if (!respuesta.success || !respuesta.data) {
      const mensajeError = respuesta.error ?? 'No fue posible responder en este momento.';
      setMessages((current) => [
        ...current,
        buildMessage({
          role: 'assistant',
          text: mensajeError,
          error: true,
        }),
      ]);
      setError(mensajeError);
      setLoading(false);
      return null;
    }

    const responseData = respuesta.data;

    setMessages((current) => [
      ...current,
      buildMessage({
        role: 'assistant',
        text: responseData.message,
        response: responseData,
      }),
    ]);
    setLoading(false);
    return responseData;
  }, [loading]);

  const availableQuickPrompts = useMemo(() => {
    if (messages.length > 2) return [];
    return QUICK_PROMPTS;
  }, [messages.length]);

  return {
    messages,
    draft,
    setDraft,
    loading,
    error,
    providerStatus,
    quickPrompts: availableQuickPrompts,
    sendMessage,
    reloadProviderStatus: loadProviderStatus,
  };
}

export const assistantActionPriority = (actions: AssistantActionDto[]) =>
  [...actions].sort((left, right) => {
    const order = (type: string) => {
      switch (type) {
        case 'open_algorithm':
          return 0;
        case 'explain_current_node':
          return 1;
        case 'open_search':
          return 2;
        default:
          return 3;
      }
    };

    return order(left.type) - order(right.type);
  });
