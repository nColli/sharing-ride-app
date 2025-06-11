import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false, title: "Gestionar usuario" }}
      />
      <Stack.Screen
        name="config-payment"
        options={{ headerShown: false, title: "Configuración de pago" }}
      />
    </Stack>
  );
}
