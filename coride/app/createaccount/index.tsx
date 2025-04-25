import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View, Text, TextInput, Button, Alert } from "react-native";

export default function Createaccount() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')

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

  const handleRepeatPasswordInput = (text: string) => {
    setRepeatPassword(text)
  }

  const handleSignup = async () => {
    if (emailError) {
      Alert.alert('Error', emailError)
      return
    }

    console.log('password', password);
    

    if (password === '') {
      Alert.alert('Error', 'Ingrese la contraseña')
      return
    }

    if (password !== repeatPassword) {
      Alert.alert('Error', 'Las contraseñas deben ser iguales')
      return
    } 

    //despues de registrarse eliminar data critica
    await AsyncStorage.multiSet([
      ['email', email],
      ['password', password]
    ]).then((response) => {console.log('store', response)})
      .catch((error) => {console.log('error', error)})

    router.navigate('createaccount/enterdata')
  }
  
  return (
      <View style={styles.container}>
        <Text style={styles.title}>¡Registra tu cuenta!</Text>
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
          placeholder="contraseña"
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
          placeholder="contraseña"
          value={repeatPassword}
          onChangeText={handleRepeatPasswordInput}
          keyboardType="default"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
        />
        <Button title="Registrar cuenta" onPress={handleSignup} />
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#2c3e50',
  },
});
