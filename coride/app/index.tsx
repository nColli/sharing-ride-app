import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "expo-router"
import { SetStateAction, useState } from "react"
import { View, Text, TextInput, StyleSheet, Button, Alert } from "react-native"

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('Ingresa tu correo electrónico');
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

  const handlePasswordInput = (text: string) => {
    setPassword(text)
  }

  const handleResetPassword = () => {
    router.navigate('resetpassword')
  }

  const handleRegisterAccount = () => {
    router.navigate('registeraccount')
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
      const response = await axios.post(url, body)
      saveUserData(response)
      navigateToHome()
      
    } catch(error) {
      console.log('error', error);
      
    }

    
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a CoRide </Text>
      <Text style={styles.subtitle}>Tu aplicación para compartir viajes</Text>

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


      <Button title="Iniciar Sesión" onPress={handleLogin} />

      <Button title="¿Olvidaste tu contraseña?" onPress={handleResetPassword} />
      <Button title="Registrate acá" onPress={handleRegisterAccount} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    paddingTop: 0
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#7f8c8d',
  },
  formContainer: {
    width: '100%',
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
})