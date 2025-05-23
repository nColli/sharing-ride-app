import { View, Text, TextInput, Button, Alert } from "react-native";
import { styles } from "../../../utils/styles";
import { useState } from "react";
import { useTrip } from "./TripContext";
import { useAuth } from "../../AuthContext";
import { saveTrip } from "../../../utils/saveTrip";
import { useRouter } from "expo-router";

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
    <View style={styles.container}>
      <Text style={styles.title}>Registra tu recorrido</Text>
      <Text style={styles.subtitle}>
        Si querés tener más probabilidades de que llenes tu auto, podes ampliar
        el radio de kilómetros para buscar y dejar personas
      </Text>
      <Text>Radio de busqueda (en kms):</Text>
      <TextInput
        style={styles.input}
        placeholder={"1"}
        value={radioBusqueda}
        onChangeText={(newRadio) => {
          setRadioBusqueda(newRadio);
        }}
        autoCapitalize={"none"}
      />
      <Text>Radio para dejar pasajeros (en kms):</Text>
      <TextInput
        style={styles.input}
        placeholder={"1"}
        value={radioDejar}
        onChangeText={(newRadio) => {
          setRadioDejar(newRadio);
        }}
        autoCapitalize={"none"}
      />
      <Text>¿Cuanto le querés cobrar a cada pasajero (ARS)?</Text>
      <TextInput
        style={styles.input}
        placeholder={"100"}
        value={precio}
        onChangeText={(newPrecio) => {
          setPrecio(newPrecio);
        }}
        autoCapitalize={"none"}
      />
      <Button title="Registrar viaje" onPress={handleRegistrarViaje} />
    </View>
  );
}
