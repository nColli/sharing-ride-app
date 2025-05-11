import { useRouter } from "expo-router"
import { View, StyleSheet, Button } from "react-native"
import { styles } from "../styles";
import LoginWelcome from "../components/LoginWelcome";
import FormLogin from "../components/FormLogin";

export default function Home() {
  const router = useRouter()

  /*
  USE EFFECT SI USUARIO ESTA VALIDADO - SEND TO HOME

  */

  return (
    <View style={styles.container}>
      <LoginWelcome></LoginWelcome>

      <FormLogin></FormLogin>

      <View style={{
        borderBottomColor: 'black', 
        borderBottomWidth: StyleSheet.hairlineWidth,
      }}>
      </View>

      <View style={styles.button}>
        <Button title="¿Olvidaste tu contraseña?" onPress={() => router.navigate('resetpassword')} />
      </View>

      <View style={styles.button}>
        <Button title="Registrate acá" onPress={() => router.navigate('createaccount')} />
      </View>
      
    </View>
  )
}
