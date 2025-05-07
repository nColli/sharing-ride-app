import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "expo-router"
import { useState } from "react"
import { View, Text, TextInput, StyleSheet, Button, Alert } from "react-native"
import { styles } from "../styles";
import LoginWelcome from "../components/LoginWelcome";
import FormLogin from "../components/FormLogin";

import LoadingOverlay from '../components/LoadingOverlay';
import useLoading from '../custom_hooks/useLoading';
import InputEmail from "../components/InputEmail";
import ErrorText from "../components/ErrorText";
import InputPassword from "../components/InputPassword";
import saveAuthToken from "../utils/saveAuthToken";

export default function Home() {
  const { isLoading, withLoading } = useLoading();

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loginError, setLoginError] = useState('');
  const router = useRouter()

  /*
  USE EFFECT SI USUARIO ESTA VALIDADO - SEND TO HOME

  */

  const isInputValid = () => {
    console.log('validate login', email, password);
    console.log('errores email', emailError);
  
    if (emailError !== '') {
      Alert.alert('Error', emailError)
      return false;
    }
    if (!password) {
      Alert.alert('Error', 'Por favor ingresa tu contraseña');
      return false;
    }

    return true
  }

  const navigateToHome = () => {
    router.navigate('home')
  }


  const handleLogin = async () => {
    console.log('handle login');

    if (!isInputValid()) {
      return
    }

    console.log('input correcto, sending request');
    
    const body = {
      email,
      password
    }

    const url = "https://backend-sharing-ride-app.onrender.com/api/login"

    try {
      await withLoading (
        axios.post(url, body)
          .then((response) => {saveAuthToken(response)})
      );
      navigateToHome()
      
    } catch(error) {
      console.log('error', error);
      
      Alert.alert('Usuario incorrecto', 'El correo o la contraseña no son correctas')
      
      setLoginError('El correo o la contraseña no son correctas')

      setTimeout(() => {
        setLoginError('');
      }, 3000)
    }
  }

  return (
    <View style={styles.container}>
      <LoginWelcome></LoginWelcome>

      <FormLogin></FormLogin>

      <View style={{
        borderBottomColor: 'black', 
        borderBottomWidth: StyleSheet.hairlineWidth,
      }}>
      </View>

      <View style={styles.button}>
        <Button title="¿Olvidaste tu contraseña?" onPress={() => router.navigate('resetpassword')} />
      </View>

      <View style={styles.button}>
        <Button title="Registrate acá" onPress={() => router.navigate('createaccount')} />
      </View>
      
    </View>
  )
}
