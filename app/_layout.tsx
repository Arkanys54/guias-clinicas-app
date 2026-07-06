import * as Notifications from "expo-notifications";
import { Href, Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useCallback, useEffect, useRef } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import {
  SafeAreaProvider,
  initialWindowMetrics,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { AppLogo } from "../components/branding/AppLogo";
import { Colors, Spacing, Typography } from "../constants/theme";
import {
  AlertasClinicasProvider,
  useAlertasClinicasCenter,
} from "../context/AlertasClinicasContext";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { extractAlertaIdFromNotificationData } from "../services/pushNotifications";

function AuthGuard() {
  const { estaAutenticado, cargando, usuario } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (cargando) return;

    const enLogin = segments[0] === "login";

    if (!estaAutenticado && !enLogin) {
      router.replace("/login");
    } else if (estaAutenticado && enLogin) {
      if (usuario?.rol === "Usuario") {
        router.replace("/(tabs)/guias");
      } else {
        router.replace("/(tabs)");
      }
    }
  }, [estaAutenticado, cargando, segments, router, usuario]);

  if (cargando) {
    return (
      <View style={styles.splash}>
        <View style={styles.splashLogo}>
          <AppLogo variant="symbol" width={50} height={38} />
        </View>
        <AppLogo variant="wordmark" width={132} height={32} />
        <Text style={styles.splashTitle}>Guías Clínicas</Text>
        <Text style={styles.splashSubtitle}>
          Cargando entorno clínico corporativo
        </Text>
        <ActivityIndicator
          size="small"
          color="rgba(255,255,255,0.7)"
          style={styles.splashSpinner}
        />
      </View>
    );
  }

  return null;
}

function NotificationRoutingBridge() {
  const router = useRouter();
  const { refreshNow } = useAlertasClinicasCenter();
  const handledResponseRef = useRef<string | null>(null);

  const handleNotificationResponse = useCallback(
    async (response: Notifications.NotificationResponse | null) => {
      if (!response) return;

      const requestIdentifier = response.notification.request.identifier;
      if (handledResponseRef.current === requestIdentifier) return;
      handledResponseRef.current = requestIdentifier;

      await refreshNow();

      const alertaId = extractAlertaIdFromNotificationData(
        response.notification.request.content.data,
      );

      if (alertaId) {
        router.push({
          pathname: "/alertas/[alertaId]" as Href,
          params: { alertaId: String(alertaId) },
        } as Href);
        return;
      }

      router.push("/alertas" as Href);
    },
    [refreshNow, router],
  );

  useEffect(() => {
    Notifications.getLastNotificationResponseAsync()
      .then((response) => {
        void handleNotificationResponse(response);
      })
      .catch(() => {
        // no-op
      });

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        void handleNotificationResponse(response);
      },
    );

    return () => subscription.remove();
  }, [handleNotificationResponse]);

  return null;
}

// Franja sólida oscura dibujada detrás de la barra de navegación del sistema.
// Expo Go corre en modo edge-to-edge, lo que deja la barra de navegación
// transparente. Esta franja repinta esa zona con un color oscuro sólido para
// que nunca se vea transparente.
function NavigationBarBackground() {
  const insets = useSafeAreaInsets();
  if (insets.bottom <= 0) return null;
  return (
    <View
      pointerEvents="none"
      style={[styles.navBarBackground, { height: insets.bottom }]}
    />
  );
}

export default function RootLayout() {
  useEffect(() => {
    // Establece el color sólido detrás de la barra de navegación de Android.
    // Sin esto, la barra de navegación se ve transparente/oscura cuando el
    // contenido no llega hasta el borde inferior de la pantalla.
    void SystemUI.setBackgroundColorAsync(Colors.background);
  }, []);

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <StatusBar style="light" />
        <AuthProvider>
          <AlertasClinicasProvider>
            <Stack
              screenOptions={{ headerShown: false }}
              initialRouteName="login"
            >
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="perfil"
                options={{ headerShown: false, presentation: "modal" }}
              />
              <Stack.Screen name="casos" options={{ headerShown: false }} />
              <Stack.Screen
                name="casos-lista"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="caso-detalle"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="asistente/index"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="algoritmos/index"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="algoritmos/[algoritmoId]"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="alertas/index"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="alertas/[alertaId]"
                options={{ headerShown: false }}
              />
            </Stack>
            <AuthGuard />
            <NotificationRoutingBridge />
            <NavigationBarBackground />
          </AlertasClinicasProvider>
        </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  navBarBackground: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000000",
  },
  splash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.lg,
  },
  splashLogo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  splashTitle: {
    ...Typography.h2,
    color: Colors.white,
  },
  splashSubtitle: {
    ...Typography.bodySmall,
    color: "rgba(255,255,255,0.72)",
  },
  splashSpinner: {
    marginTop: Spacing.sm,
  },
});
