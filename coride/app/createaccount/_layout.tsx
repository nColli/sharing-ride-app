import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="enterdata" options={{ headerShown: false }}/>
      <Stack.Screen name="enterphotos" options={{ headerShown: false }}/>
    </Stack>
  )
}
