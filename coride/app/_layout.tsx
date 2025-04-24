import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="recoverpassword"/>
      <Stack.Screen name="registeraccount"/>
      <Stack.Screen name="home" />
    </Stack>
  )
}
