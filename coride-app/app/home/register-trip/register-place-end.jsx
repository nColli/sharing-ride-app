import { useEffect, useState } from "react";
import getURL from "../../../utils/url";
import axios from "axios";
import { View, Text, TextInput, Button, ScrollView } from "react-native";
import { styles } from "../../../utils/styles";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useTrip } from "./TripContext";
import { PROVINCES } from "../../../utils/provinces";
import { useAuth } from "../../AuthContext";

export default function SelectStartPlace() {
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
    if (place.city === "" || place.province === "" || place.street === "" || place.number === "") {
      return false;
    }

    return true;
  }

  const handleContinuar = () => {
    if (isPlaceEmpty) {
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
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Registra tu recorrido</Text>
        <Text style={styles.subtitle}>
          Elegi un punto de partida habitual o agrega uno nuevo
        </Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedRegularPlace}
            onValueChange={(itemValue, itemIndex) => {
              console.log("item value pick place", itemValue);
              setSelectedRegularPlace(regularPlaces[itemIndex]);
            }}
          >
            {regularPlaces.map((place, idx) => (
              <Picker.Item key={idx} label={place.name} value={place} />
            ))}
          </Picker>
        </View>
        <Text>Calle:</Text>
        <TextInput style={styles.input} onChangeText={handleChangeCalle} />
        <Text>Numero:</Text>
        <TextInput style={styles.input} onChangeText={handleChangeNumero} />
        <Text>Localidad:</Text>
        <TextInput style={styles.input} onChangeText={handleChangeLocalidad} />

        <Text style={styles.label}>Provincia</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={place["province"]}
            onValueChange={handleChangeProvincia}
          >
            <Picker.Item label="Seleccione una provincia" value="" />
            {PROVINCES.map((prov) => (
              <Picker.Item key={prov} label={prov} value={prov} />
            ))}
          </Picker>
        </View>

        <Button title="continuar" onPress={handleContinuar} />
      </View>
    </ScrollView>
  );
}
