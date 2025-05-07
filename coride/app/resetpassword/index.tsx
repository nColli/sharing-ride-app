import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, Button, Alert } from "react-native";
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../../styles";

import LoadingOverlay from '../../components/LoadingOverlay';
import useLoading from '../../custom_hooks/useLoading';
import InputEmail from "../../components/InputEmail";
import getURL from "../../utils/url";
 
export default function Resetpassword() {
  const { isLoading, withLoading } = useLoading();
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const router = useRouter()

  const handleSendCode = async () => {
    console.log('send code');
    
    if (emailError !== '') {
      Alert.alert('Error', emailError)
      return false;
    }

    if (!email) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico');
      return false;
    }

    const body = { email }

    const url = `${getURL()}/api/resetpassword`;

    try {
      const response = await withLoading(
        axios.post(url, body)
      )

      console.log('code send, response?', response.data);
      
      await AsyncStorage.setItem('email', email).then(() => {
        console.log('email saved');
      }).catch(error => {
        console.log('error saving email', error);
      })


      //test recuperar email
      await AsyncStorage.getItem('email').then(emailSaved => {console.log('email from async', emailSaved)})
      .catch((error) => {
        console.log('error getting item', error);
        return
      })

      //navigate to entercode
      router.navigate("resetpassword/entercode")

    } catch (error) {
      console.log('error', error);
      
      Alert.alert('Error', 'Error al enviar el código, revise la dirección de correo electrónico');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Resetea tu contraseña ingresando el código que te enviaremos a tu correo electrónico</Text>
      <InputEmail 
        email={email}
        setEmail={setEmail}
        emailError={emailError}
        setEmailError={setEmailError}
      />
      <Button title="Enviar Código" onPress={handleSendCode} />

      <LoadingOverlay visible={isLoading} />
    </View>
  );
}