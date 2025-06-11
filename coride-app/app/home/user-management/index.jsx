import { useAuth } from "../../AuthContext";
import { router } from "expo-router";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function UserManagement() {
  const { setAuth } = useAuth();

  const handleLogout = () => {
    setAuth(null);
    router.push("/");
  };

  const handleConfigPayment = () => {
    router.push("/home/user-management/config-payment");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleLogout} style={styles.button}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleConfigPayment}
        style={styles.greenButton}
      >
        <Text style={styles.buttonText}>Configuración link de pago</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#ff4444",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 10,
  },
  greenButton: {
    backgroundColor: "#44aa44",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
