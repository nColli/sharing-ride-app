import { Text } from "react-native";
import { styles } from "../utils/styles";

export default function ErrorText({ error }) {
  if (!error) {
    return; // no renderizar nada si no hay error
  }

  return <Text style={styles.errorText}>{error}</Text>;
}
