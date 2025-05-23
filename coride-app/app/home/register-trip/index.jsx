import { View, Text, Button, Alert } from "react-native";
import { styles } from "../../../utils/styles";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import getURL from "../../../utils/url";
import axios from "axios";
import { useRouter } from "expo-router";
import { useTrip } from "./TripContext";
import { useAuth } from "../../AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";

export default function SelectVehicle() {
  const { auth } = useAuth();
  const { trip, setTrip } = useTrip();
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      const url = getURL() + "/api/vehicles"; //obt vehiculos del usuario

      const token = auth;

      console.log("using useFocusEffect");

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setVehicles(response.data);
        })
        .catch((error) => {
          console.log("error al obtener lugares");
          //redireccionar a home con aviso de que lo intente de nuevo
          Alert.alert("Error del servidor", "Pruebe reiniciando la aplicación");
        });
    }, []),
  );

  //solucion temporal - agregar en axios.get con response
  if (vehicles !== null && selectedVehicle === null) {
    setSelectedVehicle(vehicles[0]);
  }

  const handleRegisterVehicle = () => {
    router.navigate("home/register-vehicle"); //dsp hacer que cuando se registra vehiculo se retorne aca y no a home, marcar de donde proviene con context general
  };

  const handleContinue = () => {
    //agregar vehiculo a hook
    const newTrip = {
      ...trip,
      vehicle: selectedVehicle,
    };

    setTrip(newTrip);

    if (selectedVehicle != null) {
      router.navigate("home/register-trip/register-place-start");
      return;
    }

    //no selecciono vehiculo
    Alert.alert(
      "Seleccionar vehiculo",
      "Por favor selecciona o crea un vehiculo",
    );
    return;
  };

  const handleVehiclePick = (itemValue, itemIndex) => {
    console.log("index vehiculo", itemValue, "vehiculo", itemValue);
    setSelectedVehicle(vehicles[itemIndex]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>¡Registra tu viaje!</Text>
      <Text style={styles.subtitle}>
        Selecciona el vehículo que vas a usar en el viaje
      </Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedVehicle}
          onValueChange={handleVehiclePick}
        >
          {vehicles.map((vehicle) => (
            <Picker.Item
              label={vehicle.brand + " " + vehicle.model + " " + vehicle.year}
              value={vehicle}
              key={vehicle}
            />
          ))}
        </Picker>
      </View>
      <Button title="Continuar" onPress={handleContinue} />
      <Text style={styles.subtitle}>¿Querés registrar otro vehículo?</Text>
      <Button title="Registrar vehiculo" onPress={handleRegisterVehicle} />
    </View>
  );
}
