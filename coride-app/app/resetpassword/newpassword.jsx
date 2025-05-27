import { useState } from "react";
import { StyleSheet, View, Text, TextInput, Button, Alert } from "react-native";
import { router } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../../utils/styles";

import LoadingOverlay from "../../components/LoadingOverlay";
import useLoading from "../../custom_hooks/useLoading";

export default function Newpassword() {
  const { isLoading, withLoading } = useLoading();

  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const handlePasswordInput = (text) => {
    setPassword(text);
  };

  const handleRepeatPasswordInput = (text) => {
    setRepeatPassword(text);
  };

  const handleSendPassword = async () => {
    if (password !== repeatPassword) {
      Alert.alert("Error", "Las contraseñas deben ser iguales");
      return;
    }

    const body = {
      password,
    };

    const URL =
      "https://backend-sharing-ride-app.onrender.com/api/user/changepassword";

    const token = await AsyncStorage.getItem("authToken");

    console.log("url", URL, "token", token);

    try {
      await withLoading(
        axios.put(URL, body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );
      console.log("password changed");

      goToHome();
    } catch (error) {
      console.log("error", error);
      router.navigate("../"); //back to index
    }
  };

  const goToHome = () => {
    router.navigate("../home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Ingresa tu nueva contraseña</Text>
      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder=""
        value={password}
        onChangeText={handlePasswordInput}
        keyboardType="default"
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry
      />

      <Text style={styles.label}>Repetí la contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder=""
        value={repeatPassword}
        onChangeText={handleRepeatPasswordInput}
        keyboardType="default"
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry
      />
      <Button title="Registrar contraseña" onPress={handleSendPassword} />

      <LoadingOverlay visible={isLoading} />
    </View>
  );
}
