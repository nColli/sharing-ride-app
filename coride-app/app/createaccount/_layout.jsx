import { Stack } from "expo-router";
import UserProvider from "./UserContext";

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="formpersonaldata"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="enterphotos" options={{ headerShown: false }} />
      </Stack>
    </UserProvider>
  );
}
