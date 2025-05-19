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
      </Stack>
    </TripProvider>
  );
}
