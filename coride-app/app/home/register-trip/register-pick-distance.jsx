import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Pressable,
} from "react-native";
import { styles } from "../../../utils/styles";
import { useState } from "react";
import { useTrip } from "./TripContext";
import { useAuth } from "../../AuthContext";
import { saveTrip } from "../../../utils/saveTrip";
import { useRouter } from "expo-router";
import KeyboardAwareContainer from "../../../components/KeyboardAwareContainer";

export default function RegisterDistance() {
  const [radioBusqueda, setRadioBusqueda] = useState("1");
  const [radioDejar, setRadioDejar] = useState("1");
  const [precio, setPrecio] = useState("100");
  const { trip, setTrip } = useTrip();
  const { auth } = useAuth();
  const router = useRouter();

  const handleRegistrarViaje = async () => {
    try {
      //crear viaje de acuerdo a si es o no una rutina
      const tripToPost = {
        ...trip,
        searchRadiusKm: radioBusqueda,
        arrivalRadiusKm: radioDejar,
        pricePerPassenger: precio,
      };

      setTrip(tripToPost);

      const tokenAuth = auth;
      const response = await saveTrip(tripToPost, tokenAuth);

      console.log("response save trip", response);

      Alert.alert("Éxito", "Viaje registrado correctamente");
      router.navigate("/home");
    } catch (error) {
      console.error("Error al guardar el viaje:", error);

      Alert.alert(
        "Error",
        "No se pudo registrar el viaje. Por favor, inténtelo nuevamente.",
      );
      router.navigate("/home");
    }
  };

  return (
    <KeyboardAwareContainer>
      <View style={localStyles.container}>
        <Text style={localStyles.title}>Registra tu recorrido</Text>

        <View style={localStyles.infoContainer}>
          <Text style={localStyles.description}>
            Si querés tener más probabilidades de que llenes tu auto, podés
            ampliar el radio de kilómetros para buscar y dejar personas
          </Text>
        </View>

        <View style={localStyles.formContainer}>
          <Text style={localStyles.sectionTitle}>Configuración del viaje</Text>

          <View style={localStyles.inputGroup}>
            <Text style={localStyles.label}>Radio de búsqueda (en kms):</Text>
            <TextInput
              style={localStyles.input}
              placeholder="1"
              value={radioBusqueda}
              onChangeText={(newRadio) => {
                setRadioBusqueda(newRadio);
              }}
              autoCapitalize="none"
              keyboardType="numeric"
            />
          </View>

          <View style={localStyles.inputGroup}>
            <Text style={localStyles.label}>
              Radio para dejar pasajeros (en kms):
            </Text>
            <TextInput
              style={localStyles.input}
              placeholder="1"
              value={radioDejar}
              onChangeText={(newRadio) => {
                setRadioDejar(newRadio);
              }}
              autoCapitalize="none"
              keyboardType="numeric"
            />
          </View>

          <View style={localStyles.inputGroup}>
            <Text style={localStyles.label}>
              ¿Cuánto le querés cobrar a cada pasajero (ARS)?
            </Text>
            <TextInput
              style={localStyles.input}
              placeholder="100"
              value={precio}
              onChangeText={(newPrecio) => {
                setPrecio(newPrecio);
              }}
              autoCapitalize="none"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={localStyles.buttonContainer}>
          <Pressable
            style={localStyles.registerButton}
            onPress={handleRegistrarViaje}
          >
            <Text style={localStyles.registerButtonText}>Registrar viaje</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAwareContainer>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  infoContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    color: "#333",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  buttonContainer: {
    marginTop: 10,
  },
  registerButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  registerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
