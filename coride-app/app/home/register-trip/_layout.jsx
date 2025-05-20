import { Stack } from "expo-router";
import TripProvider from "./TripContext";

export default function RootLayout() {
  return (
    <TripProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ headerShown: false, title: "Registrar viaje" }}
        />
        <Stack.Screen
          name="register-place-start"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="register-place-end"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="register-time-start"
          options={{ headerShown: false }}
        />
      </Stack>
    </TripProvider>
  );
}
