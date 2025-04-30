import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "expo-router"
import { SetStateAction, useState } from "react"
import { View, Text, TextInput, StyleSheet, Button, Alert } from "react-native"
import { styles } from "../styles";
import LoginWelcome from "../components/LoginWelcome";

import LoadingOverlay from '../components/LoadingOverlay';
import useLoading from '../custom_hooks/useLoading';

export default function Home() {
  const { isLoading, withLoading } = useLoading();

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('Ingresa tu correo electrónico');
  const router = useRouter()

  /*
  USE EFFECT SI USUARIO ESTA VALIDADO - SEND TO HOME

  */


  const validateEmail = (text: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    setEmail(text);
    if (text === '') {
      setEmailError('Ingresa tu correo electrónico'); // Clear error when empty
    } else if (!emailRegex.test(text)) {
      setEmailError('Por favor ingresa un correo válido');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordInput = (text: string) => {
    setPassword(text)
  }

  const handleResetPassword = () => {
    router.navigate('resetpassword')
  }

  const handleRegisterAccount = () => {
    router.navigate('createaccount')
  }

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

  const saveUserData = async (response: AxiosResponse<any>) => {
    console.log('response', response);
    
    const authToken = response.data.tokenLogin;

    console.log('token', authToken);

    await AsyncStorage.setItem('authToken', authToken).then(() => {
      console.log('email saved');
    }).catch(error => {
      console.log('error saving email', error);
    })

    await AsyncStorage.getItem('authToken').then(t => {console.log('token from async', t)})
      .catch((error) => {
        console.log('error getting item', error);
        return
      })
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
          .then((response) => {saveUserData(response)})
      );
      navigateToHome()
      
    } catch(error) {
      console.log('error', error);
      
      Alert.alert('Usuario incorrecto', 'El correo o la contraseña no son correctas')
    }

    
  }

  return (
    <View style={styles.container}>
      <LoginWelcome></LoginWelcome>

      <Text style={styles.label}>Correo electrónico</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu correo"
        value={email}
        onChangeText={validateEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu contraseña"
        value={password}
        onChangeText={handlePasswordInput}
        keyboardType="default"
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry
      />

      <View style={styles.button}>
        <Button title="Iniciar Sesión" onPress={handleLogin} />
      </View>

      <View style={styles.button}>
        <Button title="¿Olvidaste tu contraseña?" onPress={handleResetPassword} />
      </View>

      <View style={styles.button}>
        <Button title="Registrate acá" onPress={handleRegisterAccount} />
      </View>
      
      <LoadingOverlay visible={isLoading} />
    </View>
  )
}
