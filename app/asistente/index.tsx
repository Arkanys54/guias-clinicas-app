import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { AssistantScreen } from '../../components/assistant/AssistantScreen';

export default function AssistantRoute() {
  const params = useLocalSearchParams<{ mensaje?: string | string[]; enviar?: string | string[] }>();
  const rawMensaje = Array.isArray(params.mensaje) ? params.mensaje[0] : params.mensaje;
  const rawEnviar = Array.isArray(params.enviar) ? params.enviar[0] : params.enviar;

  return (
    <AssistantScreen
      initialMessage={rawMensaje ?? null}
      autoSendInitial={rawEnviar === '1'}
    />
  );
}
