

import { useRouter } from "expo-router";
import { Button, View } from "react-native";
import { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Alert
} from 'react-native';
import LoginWelcome from "../components/LoginWelcome";
import URL from '../variables'
import axios from 'axios'

export default function Home() {
  const router = useRouter()
  console.log('router', router);
  
  router.navigate('recoverpassword')

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');

  // Validacion email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  const validateEmail = (text) => {
    setEmail(text);
    if (text === '') {
      setEmailError(''); // Clear error when empty
    } else if (!emailRegex.test(text)) {
      setEmailError('Por favor ingresa un correo válido');
    } else {
      setEmailError('');
    }
  };
  
  const handleLogin = async () => {
      // Validar que no haya errores
    if (emailError !== '') {
      Alert.alert('Error', emailError)
      return;
    }
    
    if (!password) {
      Alert.alert('Error', 'Por favor ingresa tu contraseña');
      return;
    }

    const body = {
        email,
        password
    };
    
    const URL_LOGIN = URL.concat('/api/login');
    console.log('request url', URL_LOGIN);

    console.log('credentials', body);
    
    
    try {
      /*
      const response = await axios.post(URL_LOGIN, body, {
          headers: {
              'Content-Type': 'application/json'
          }
      });
      */
      const response = await axios.post(URL_LOGIN, body);

      console.log('response', response);
      

      const user = response.data.user
      const authToken = response.data.token;

      console.log('user', user, 'authToken', authToken);
      /*
      await AsyncStorage.multiSet([
          ['authToken', authToken],
          ['userData', JSON.stringify(user)]
      ]);
      */
      console.log('before nav');
      
      router.navigate('recoverpassword')

      console.log('exec');
      

    } catch (error) {
      const codeError = error.response.status
      console.log('code error', codeError); 

      const errorMessage = codeError === 401 ? 'Correo electrónico o contraseña incorrecta' : 'Servicio no disponible, intente nuevamente más tarde'

      Alert.alert(
        'Error al iniciar sesión',
        errorMessage
      )
    }

  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <LoginWelcome />

        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa tu correo"
          value={email}
          onChangeText={validateEmail}
          onBlur={() => {
            if (email && !emailRegex.test(email)) {
              setEmailError('Por favor ingresa un correo válido');
            }
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa tu contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => router.navigate('recoverpassword')}
        >
          <Text style={styles.secondaryButtonText}>Olvidé mi contraseña</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
          <Text style={styles.primaryButtonText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>¿No tenés cuenta? </Text>
          <TouchableOpacity onPress={() => router.navigate('registeraccount')}>
            <Text style={styles.registerLink}>Regístrate aquí</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
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
  primaryButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  secondaryButtonText: {
    color: '#3498db',
    fontSize: 14,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    color: '#7f8c8d',
  },
  registerLink: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 15,
  },
});
