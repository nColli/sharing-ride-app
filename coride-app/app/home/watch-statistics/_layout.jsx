import { Stack } from "expo-router";

export default function StatisticsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#007AFF",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Estadísticas",
          headerTitle: "Estadísticas de Viajes",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
