import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { styles } from "../../styles";

export default function Createaccount() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('Ingrese el correo')
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

    router.navigate('createaccount/formpersonaldata')
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
        <View>
          <Button title="Registrar cuenta" onPress={handleSignup} />
        </View>
      </View>
    );
}
