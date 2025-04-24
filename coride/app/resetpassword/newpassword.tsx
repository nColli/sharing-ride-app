import { useState } from "react"
import { StyleSheet, View, Text, TextInput, Button, Alert } from "react-native"
import { router } from "expo-router"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function Newpassword() {
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')

  const handlePasswordInput = (text: string) => {
    setPassword(text)
  }

  const handleRepeatPasswordInput = (text: string) => {
    setRepeatPassword(text)
  }

  const handleSendPassword = async () => {
    if (password !== repeatPassword) {
      Alert.alert('Error', 'Las contraseñas deben ser iguales')
      return
    } 

    const body = {
      password
    }

    const URL = "https://backend-sharing-ride-app.onrender.com/api/user/changepassword"

    const token = await AsyncStorage.getItem('authToken')

    console.log('url', URL, 'token', token);
    
    try {
      const response = await axios.put(URL, body, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('response', response.data);

      goToHome()

    } catch (error) {
      console.log('error', error);
      router.navigate('../') //back to index
    }
  }

  const goToHome = () => {
    router.navigate('../home')
  }

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
