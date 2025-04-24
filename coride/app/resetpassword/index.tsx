import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View, Text, TextInput, Button, Alert } from "react-native";
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage";
 
export default function Resetpassword() {
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
      const response = await axios.post(url, body)
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    padding: 15,
    backgroundColor: '#fff',
    paddingTop: 25
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#2c3e50',
  },
  input: {
    height: 50,
    borderColor: '#bdc3c7',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#7f8c8d',
  },
});
