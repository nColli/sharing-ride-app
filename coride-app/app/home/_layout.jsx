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
      <Stack.Screen
        name="pending-trips"
        options={{ title: "Viajes pendientes" }}
      />
      <Stack.Screen name="reserve-trip" options={{ title: "Reservar viaje" }} />
      <Stack.Screen
        name="pending-reserves"
        options={{ title: "Reservas de viajes" }}
      />
      <Stack.Screen name="next-trip" options={{ title: "Proximo viaje" }} />
      <Stack.Screen
        name="user-management"
        options={{ title: "Gestion de usuario" }}
      />
      <Stack.Screen name="start-trip" options={{ title: "Iniciar viaje" }} />
      <Stack.Screen
        name="review-driver"
        options={{ title: "Evaluar conductor" }}
      />
      <Stack.Screen
        name="watch-statistics"
        options={{ title: "Ver estadísticas" }}
      />
    </Stack>
  );
}
