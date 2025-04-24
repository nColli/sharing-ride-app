import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View, Text, TextInput, Button, Alert } from "react-native";
import axios, { AxiosResponse } from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Entercode() {
  const [token, setToken] = useState('')
  const [email, setEmail] = useState('');
  const router = useRouter()

  const saveToken = (code: string) => {
    setToken(code)
  };

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

  const navigateToIndex = () => {
    router.navigate('../index')
  }
  
  const handleSendToken = async () => {
    console.log('handle send code');
    
    const email = await AsyncStorage.getItem('email')
    
    console.log('email', email);

    const body = {
      email
    }

    const URL = "https://backend-sharing-ride-app.onrender.com/api/resetpassword/"
    const URL_TOKEN = URL.concat(token)

    console.log('url', URL_TOKEN);
    
    try {
      const response = await axios.post(URL_TOKEN, body)
      saveUserData(response)
      
      router.navigate('resetpassword/newpassword')

    } catch (error) {
      console.log('error', error);
      router.navigate('../') //back to index
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Ingresa el código que te enviamos al correo electrónico, acordate revisar spam o correos no deseados</Text>
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
    </View>
  )
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