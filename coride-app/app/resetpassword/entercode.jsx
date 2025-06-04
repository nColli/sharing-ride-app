import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import axios, { AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../../utils/styles";
import getUrl from "../../utils/url";
import LoadingOverlay from "../../components/LoadingOverlay";
import useLoading from "../../custom_hooks/useLoading";
import { useAuth } from "../AuthContext";

export default function Entercode() {
  const { isLoading, withLoading } = useLoading();
  const { setAuth } = useAuth();

  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  const saveToken = (code) => {
    setToken(code);
  };

  const saveUserData = async (response) => {
    console.log("response", response);

    const authToken = response.data.tokenLogin;

    console.log("token", authToken);

    setAuth(authToken);
  };

  const navigateToIndex = () => {
    router.navigate("../index");
  };

  const handleSendToken = async () => {
    console.log("handle send code");

    const email = await AsyncStorage.getItem("email");

    console.log("email", email);

    const body = {
      email,
    };

    const URL = `${getUrl()}/api/resetpassword/`;
    const URL_TOKEN = URL.concat(token);

    console.log("url", URL_TOKEN);

    try {
      /*const response = await axios.post(URL_TOKEN, body)
      saveUserData(response)*/
      await withLoading(
        axios.post(URL_TOKEN, body).then((response) => {
          saveUserData(response);
        }),
      );

      router.navigate("resetpassword/newpassword");
    } catch (error) {
      console.log("error", error);
      router.navigate("../"); //back to index
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>
        Ingresa el código que te enviamos al correo electrónico, acordate
        revisar spam o correos no deseados
      </Text>
      <Text style={styles.label}>Código</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa el código"
        value={token}
        onChangeText={saveToken}
        keyboardType="default"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Button title="Validar Código" onPress={handleSendToken} />

      <LoadingOverlay visible={isLoading} />
    </View>
  );
}
