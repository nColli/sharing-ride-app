import { View, Button, StyleSheet, Pressable, Text } from "react-native";
import { styles } from "../utils/styles";
import { router } from "expo-router";
import LoginWelcome from "../components/LoginWelcome";
import FormLogin from "../components/FormLogin";
import Line from "../components/Line";

export default function Login() {
  return (
    <View style={localStyles.container}>
      <LoginWelcome />

      <FormLogin />

      <Line />

      <View style={localStyles.buttonContainer}>
        <Pressable
          style={localStyles.forgotPasswordButton}
          onPress={() => router.push("/resetpassword")}
        >
          <Text style={localStyles.forgotPasswordButtonText}>
            ¿Olvidaste tu contraseña?
          </Text>
        </Pressable>

        <Pressable
          style={localStyles.registerButton}
          onPress={() => router.push("/createaccount")}
        >
          <Text style={localStyles.registerButtonText}>Registrate acá</Text>
        </Pressable>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  buttonContainer: {
    gap: 15,
    marginTop: 20,
  },
  forgotPasswordButton: {
    backgroundColor: "#8E8E93",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  forgotPasswordButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  registerButton: {
    backgroundColor: "#34C759",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  registerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
