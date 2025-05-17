import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="resetpassword" options={{ title: 'Resetear contraseña' }}/>
      <Stack.Screen name="createaccount" options={{ title: 'Registrar cuenta' }}/>
      <Stack.Screen name="home" options={{ headerShown: false }}/>
    </Stack>
  )
}
