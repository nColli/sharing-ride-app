import { Text } from "react-native";
import { styles } from "../styles";

export default function ErrorText({ error }: { error: string }) {
    if (!error) {
        return // no renderizar nada si no hay error
    }

    return (
        <Text style={styles.errorText}>{error}</Text>
    );
}
