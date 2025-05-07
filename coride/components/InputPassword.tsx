import { View, TextInput, Text } from "react-native";
import { styles } from "../styles";
import ErrorText from "./ErrorText";

export default function InputPassword({ password, setPassword }: any) {
  const handlePasswordInput = (text: string) => {
    //implementar validacion de lineamientos contraseña
    setPassword(text)
  }

  return (
    <View>
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
    </View>
  );
}