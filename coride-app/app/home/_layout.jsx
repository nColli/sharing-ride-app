import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false, title: "Inicio" }}
      />
      <Stack.Screen
        name="register-vehicle"
        options={{ title: "Registrar vehículo" }}
      />
      <Stack.Screen
        name="create-regular-place"
        options={{ title: "Agregar lugar habitual" }}
      />
      <Stack.Screen
        name="register-trip"
        options={{ title: "Registrar viaje" }}
      />
    </Stack>
  );
}
