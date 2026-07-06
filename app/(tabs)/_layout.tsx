import { Tabs } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function TabsLayout() {
  const { usuario } = useAuth();

  const esUsuario = usuario?.rol === 'Usuario';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        lazy: false,
        tabBarStyle: { display: 'none' },
      }}
    >
      {/* Búsqueda — solo Admin y Empresa */}
      <Tabs.Screen
        name="index"
        options={{
          href: esUsuario ? null : undefined,
        }}
      />

      {/* Modo decisión — solo Admin y Empresa */}
      <Tabs.Screen
        name="nueva"
        options={{
          href: esUsuario ? null : undefined,
        }}
      />

      {/* Guías — todos los roles */}
      <Tabs.Screen
        name="guias"
      />
    </Tabs>
  );
}