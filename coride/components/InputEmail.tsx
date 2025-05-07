import { View, TextInput, Text } from "react-native";
import { styles } from "../styles";
import { validateEmailAndGetError } from "../utils/validateEmail";
import ErrorText from "./ErrorText";

export default function InputEmail({ email, setEmail, emailError, setEmailError }: any) {
  const handleEmailInput = (text: string) => {
    setEmail(text)
    const error = validateEmailAndGetError(text);
    console.log('error desde handleInput', error);
    
    setEmailError(error);
  }
  

  return (
    <View>
      <Text style={styles.label}>Correo electrónico</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={handleEmailInput}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <ErrorText error={emailError}/>
    </View>
  );
}