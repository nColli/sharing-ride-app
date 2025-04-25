import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View, Text, TextInput, Button, Alert } from "react-native";

export default function Enterdata() {
  const [dni, setDni] = useState('')
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')

  const router = useRouter()

  const handleDni = (text: string) => {
    setDni(text)
  }

  const handleNombre = (text: string) => {
    setNombre(text)
  }

  const handleApellido = (text: string) => {
    setApellido(text)
  }

  const handleSignup = async () => {
    if (dni || nombre || apellido) {
      Alert.alert('Error', 'Complete todos los campos')
    }

    //despues de registrarse eliminar data critica
    await AsyncStorage.multiSet([
      ['dni', dni],
      ['nombre', nombre],
      ['apellido', apellido]
    ]).then((response) => {console.log('store', response)})
      .catch((error) => {console.log('error', error)})

    router.navigate('enterphotos')
  }
  
  return (
      <View style={styles.container}>
        <Text style={styles.title}>¡Registra tu cuenta!</Text>
        <Text style={styles.label}>DNI</Text>
        <TextInput
          style={styles.input}
          placeholder="11.111.111"
          value={dni}
          onChangeText={handleDni}
          keyboardType="default"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Text style={styles.label}>Repetí la contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Juan"
          value={nombre}
          onChangeText={handleNombre}
          keyboardType="default"
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        <Text style={styles.label}>Repetí la contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Perez"
          value={apellido}
          onChangeText={handleApellido}
          keyboardType="default"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Button title="Continuar" onPress={handleSignup} />
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
