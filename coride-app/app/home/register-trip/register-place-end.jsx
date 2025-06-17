import { useEffect, useState } from "react";
import getURL from "../../../utils/url";
import axios from "axios";
import { View, Text, TextInput, Button, Alert, StyleSheet, Pressable } from "react-native";
import { styles } from "../../../utils/styles";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useTrip } from "./TripContext";
import { PROVINCES } from "../../../utils/provinces";
import { useAuth } from "../../AuthContext";
import KeyboardAwareContainer from "../../../components/KeyboardAwareContainer";

export default function SelectPlaceEnd() {
  const { auth } = useAuth();
  const { trip, setTrip } = useTrip();

  const defaultPlace = {
    name: "",
    street: "",
    number: "",
    city: "",
  };

  const [place, setPlace] = useState(defaultPlace);
  const [regularPlaces, setRegularPlaces] = useState([]);
  const [selectedRegularPlace, setSelectedRegularPlace] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const url = getURL() + "/api/places";

    const token = auth;

    console.log("token", token);

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const regularPlaces = response.data;
        setRegularPlaces(regularPlaces);
        setSelectedRegularPlace(regularPlaces[0]);
      })
      .catch((error) => {
        console.log("error al obtener lugares");
        //redireccionar a home con aviso de que lo intente de nuevo
      });
  }, []);

  const handleChangeCalle = (calle) => {
    const newPlace = {
      ...place,
      street: calle,
    };

    setPlace(newPlace);
  };

  const handleChangeNumero = (numero) => {
    const newPlace = {
      ...place,
      number: numero,
    };

    setPlace(newPlace);
  };

  const handleChangeLocalidad = (localidad) => {
    const newPlace = {
      ...place,
      city: localidad,
    };

    setPlace(newPlace);
  };

  const handleChangeProvincia = (provincia) => {
    const newPlace = {
      ...place,
      province: provincia,
    };

    setPlace(newPlace);
  };

  function isPlaceEmpty() {
    if (
      place.city === "" ||
      place.province === "" ||
      place.street === "" ||
      place.number === ""
    ) {
      return true;
    }

    return false;
  }

  const handleContinuar = () => {
    if (isPlaceEmpty()) {
      console.log("lugar ya registrado elegido");
      console.log("selectedRegularPlace", selectedRegularPlace);

      const newTrip = {
        ...trip,
        placeEnd: selectedRegularPlace,
      };

      console.log("new trip en seleccionar lugar de llegada", newTrip);

      setTrip(newTrip);
    } else {
      console.log("lugar nuevo elegido", place);

      const newTrip = {
        ...trip,
        placeEnd: place,
      };

      console.log("new trip en seleccionar lugar de llegada", newTrip);

      setTrip(newTrip);
    }

    router.navigate("/home/register-trip/register-time-start");
  };

  return (
    <KeyboardAwareContainer>
      <View style={localStyles.container}>
        <Text style={localStyles.title}>Registra tu recorrido</Text>

        <View style={localStyles.infoContainer}>
          <Text style={localStyles.sectionTitle}>Lugar de llegada</Text>
          <Text style={localStyles.description}>
            Selecciona un lugar guardado o ingresa uno nuevo
          </Text>

          <View style={localStyles.pickerContainer}>
            <Text style={localStyles.label}>Lugares guardados:</Text>
            <Picker
              selectedValue={selectedRegularPlace}
              onValueChange={(itemValue) => setSelectedRegularPlace(itemValue)}
              style={localStyles.picker}
            >
              {regularPlaces.map((place, index) => (
                <Picker.Item
                  label={`${place.name} - ${place.street} ${place.number}, ${place.city}`}
                  value={place}
                  key={index}
                />
              ))}
            </Picker>
          </View>

          <Text style={localStyles.label}>O ingresa un nuevo lugar:</Text>
          <TextInput
            style={localStyles.input}
            placeholder="Calle"
            value={place.street}
            onChangeText={handleChangeCalle}
          />
          <TextInput
            style={localStyles.input}
            placeholder="Número"
            value={place.number}
            onChangeText={handleChangeNumero}
          />
          <TextInput
            style={localStyles.input}
            placeholder="Localidad"
            value={place.city}
            onChangeText={handleChangeLocalidad}
          />
          <Picker
            selectedValue={place.province}
            onValueChange={handleChangeProvincia}
            style={localStyles.picker}
          >
            {PROVINCES.map((province, index) => (
              <Picker.Item
                label={province}
                value={province}
                key={index}
              />
            ))}
          </Picker>
        </View>

        <View style={localStyles.buttonContainer}>
          <Pressable
            style={localStyles.continueButton}
            onPress={handleContinuar}
          >
            <Text style={localStyles.continueButtonText}>Continuar</Text>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
    lineHeight: 20,
  },
  pickerContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  picker: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#f8f8f8",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
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
