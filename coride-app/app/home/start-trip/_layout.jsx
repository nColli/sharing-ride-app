import { Stack } from "expo-router";
import TripProvider from "./TripContext";

export default function RootLayout() {
  return (
    <TripProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ headerShown: false, title: "Proximo viaje" }}
        />
        <Stack.Screen
          name="start-route"
          options={{ headerShown: false, title: "Iniciar viaje" }}
        />
        <Stack.Screen
          name="finish-route"
          options={{ headerShown: false, title: "Terminar viaje" }}
        />
      </Stack>
    </TripProvider>
  );
}
