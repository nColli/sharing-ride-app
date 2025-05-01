import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../../styles";

import LoadingOverlay from '../../components/LoadingOverlay';
import useLoading from '../../custom_hooks/useLoading';
 
export default function Resetpassword() {
  const { isLoading, withLoading } = useLoading();

  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('Ingresa tu correo electrónico')

  const router = useRouter()

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

  const handleSendCode = async () => {
    console.log('send code');
    
    if (emailError !== '') {
      Alert.alert('Error', emailError)
      return false;
    }

    const body = { email }

    const url = "https://backend-sharing-ride-app.onrender.com/api/resetpassword"

    try {
      //const response = await axios.post(url, body)
      await withLoading(
        axios.post(url, body)
      )

      //console.log('response', response);
      console.log('code send');
      
      
      //guardar email para resetear 
      //const store = await AsyncStorage.setItem('email', email)
      //console.log('store', store);
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
      
      Alert.alert('Error', 'Hubo un error al enviar el código')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Resetea tu contraseña ingresando el código que te enviaremos a tu correo electrónico</Text>
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
      <Button title="Enviar Código" onPress={handleSendCode} />

      <LoadingOverlay visible={isLoading} />
    </View>
  );
}