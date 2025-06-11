import { Alert, Button, View } from "react-native";
import InputEmail from "./InputEmail";
import InputPassword from "./InputPassword";
import ErrorText from "./ErrorText";
import { styles } from "../utils/styles";
import useLoading from "../custom_hooks/useLoading.js";
import { useState } from "react";
import { useRouter } from "expo-router";
import axios from "axios";
import LoadingOverlay from "./LoadingOverlay";
import getUrl from "../utils/url";
import { useAuth } from "../app/AuthContext";

export default function FormLogin() {
  const { isLoading, withLoading } = useLoading();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loginError, setLoginError] = useState("");
  const router = useRouter();
  const { setAuth } = useAuth();

  const isInputValid = () => {
    if (emailError !== "") {
      Alert.alert("Error", emailError);
      return false;
    }
    if (!password) {
      Alert.alert("Error", "Por favor ingresa tu contraseña");
      return false;
    }

    return true;
  };

  const navigateToHome = () => {
    router.push("home");
  };

  function saveAuthToken(response) {
    const token = response.data.tokenLogin;

    console.log("token", token);

    //guardan con context
    setAuth(token);
  }

  const handleLogin = async () => {
    if (!isInputValid()) {
      return null;
    }

    const body = {
      email,
      password,
    };

    const url = `${getUrl()}/api/login`;

    try {
      await withLoading(
        axios.post(url, body).then((response) => {
          saveAuthToken(response);
        }),
      );

      navigateToHome();
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setLoginError("El correo o la contraseña no son correctas");

      setTimeout(() => {
        setLoginError("");
      }, 3000);
    }
  };

  return (
    <View>
      <InputEmail
        email={email}
        setEmail={setEmail}
        emailError={emailError}
        setEmailError={setEmailError}
      />

      <InputPassword password={password} setPassword={setPassword} />

      <ErrorText error={loginError} />

      <View style={styles.button}>
        <Button title="Iniciar Sesión" onPress={handleLogin} />
      </View>

      <LoadingOverlay visible={isLoading} />
    </View>
  );
}
