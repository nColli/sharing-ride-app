import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="registervehicle" options={{ title: 'Registrar vehículo' }}/>
      <Stack.Screen name="createregularplace" options={{ title: 'Registrar lugar habitual' }}/>
    </Stack>
  )
}
