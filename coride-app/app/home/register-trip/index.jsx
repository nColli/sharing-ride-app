import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  Pressable,
} from "react-native";
import { styles } from "../../../utils/styles";
import { Picker } from "@react-native-picker/picker";
import { useState, useCallback } from "react";
import getURL from "../../../utils/url";
import axios from "axios";
import { useRouter } from "expo-router";
import { useTrip } from "./TripContext";
import { useAuth } from "../../AuthContext";
import { useFocusEffect } from "@react-navigation/native";

export default function SelectVehicle() {
  const { auth } = useAuth();
  const { trip, setTrip } = useTrip();
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      // Clear trip state when entering the registration flow
      setTrip(null);

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
          const vehiclesList = response.data;
          setVehicles(vehiclesList);
          setSelectedVehicle(vehiclesList[0]); //selecciona el primero - prob. de que user seleccione el primero o tenga un vehiculo es alta
        })
        .catch((error) => {
          console.log("error al obtener lugares");
          //redireccionar a home con aviso de que lo intente de nuevo
          Alert.alert("Error del servidor", "Pruebe reiniciando la aplicación");
        });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  //solucion temporal - agregar en axios.get con response
  if (vehicles !== null && selectedVehicle === null) {
    setSelectedVehicle(vehicles[0]);
  }

  const handleRegisterVehicle = () => {
    router.navigate("home/register-vehicle"); //cuando se registra vehiculo se retorne aca y no a home,
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
    <View style={localStyles.container}>
      <Text style={localStyles.title}>¡Registra tu viaje!</Text>

      <View style={localStyles.infoContainer}>
        <Text style={localStyles.description}>
          Selecciona el vehículo que vas a usar en el viaje
        </Text>
      </View>

      <View style={localStyles.vehicleContainer}>
        <Text style={localStyles.sectionTitle}>Vehículo seleccionado</Text>
        
        <View style={localStyles.pickerContainer}>
          <Picker
            selectedValue={selectedVehicle}
            onValueChange={handleVehiclePick}
            style={localStyles.picker}
          >
            {vehicles.map((vehicle, index) => (
              <Picker.Item
                label={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
                value={vehicle}
                key={index}
              />
            ))}
          </Picker>
        </View>
      </View>

      <View style={localStyles.addVehicleContainer}>
        <Text style={localStyles.sectionTitle}>
          ¿Querés registrar otro vehículo?
        </Text>
        
        <Pressable
          style={localStyles.addVehicleButton}
          onPress={handleRegisterVehicle}
        >
          <Text style={localStyles.addVehicleButtonText}>
            Registrar vehículo
          </Text>
        </Pressable>
      </View>

      <View style={localStyles.buttonContainer}>
        <Pressable style={localStyles.continueButton} onPress={handleContinue}>
          <Text style={localStyles.continueButtonText}>Continuar</Text>
        </Pressable>
      </View>
    </View>
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
  vehicleContainer: {
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
    marginBottom: 15,
    color: "#333",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  picker: {
    height: 50,
  },
  addVehicleContainer: {
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
  addVehicleButton: {
    backgroundColor: "#34C759",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addVehicleButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonContainer: {
    marginTop: 10,
  },
  continueButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
