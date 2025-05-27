import { Stack } from "expo-router";
import AuthProvider from "./AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen
          name="resetpassword"
          options={{ title: "Resetear contraseña" }}
        />
        <Stack.Screen
          name="createaccount"
          options={{ title: "Crear cuenta" }}
        />
      </Stack>
    </AuthProvider>
  );
}
