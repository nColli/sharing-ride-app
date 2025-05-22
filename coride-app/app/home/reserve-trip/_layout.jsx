import { Stack } from "expo-router";
import ReserveProvider from "./ReserveContext";

export default function RootLayout() {
  return (
    <ReserveProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ headerShown: false, title: "Reservar viaje" }}
        />
        <Stack.Screen
          name="register-place-end"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="register-time-start"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="register-routine"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="confirm-reserve" options={{ headerShown: false }} />
      </Stack>
    </ReserveProvider>
  );
}
