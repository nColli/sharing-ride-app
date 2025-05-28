import { useAuth } from "../../AuthContext";
import { router } from "expo-router";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function UserManagement() {
  const { setAuth } = useAuth();

  const handleLogout = () => {
    setAuth(null);
    router.push("/");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleLogout} style={styles.button}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#ff4444",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
