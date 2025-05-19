import { View, Button } from "react-native";
import { styles } from "../utils/styles";
import { router } from "expo-router";
import LoginWelcome from "../components/LoginWelcome";
import FormLogin from "../components/FormLogin";
import Line from "../components/Line";

export default function Login() {
  return (
    <View style={styles.container}>
      <LoginWelcome />

      <FormLogin />

      <Line />

      <View style={styles.button}>
        <Button
          title="¿Olvidaste tu contraseña?"
          onPress={() => router.navigate("resetpassword")}
        />
      </View>

      <View style={styles.button}>
        <Button
          title="Registrate acá"
          onPress={() => router.navigate("createaccount")}
        />
      </View>
    </View>
  );
}
