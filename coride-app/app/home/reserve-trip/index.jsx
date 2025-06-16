import { useState, useEffect, useCallback } from "react";
import { View, Text, Button, Alert, ScrollView, TextInput } from "react-native";
import { styles } from "../../../utils/styles";
import { useReserve } from "./ReserveContext";
import { useAuth } from "../../AuthContext";
import { useRouter } from "expo-router";
import getURL from "../../../utils/url";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import { PROVINCES } from "../../../utils/provinces";
import { useFocusEffect } from "@react-navigation/native";

export default function SelectPlaceStart() {
  const defaultPlace = {
    name: "",
    street: "",
    number: "",
    city: "",
    province: "",
  };

  const [place, setPlace] = useState(defaultPlace);
  const [selectedRegularPlace, setSelectedRegularPlace] = useState(null);
  const { auth } = useAuth();
  const router = useRouter();

  //guardar lugar de partida en context de reserve-trip
  const { reserve, setReserve } = useReserve();

  const [regularPlaces, setRegularPlaces] = useState([]);
  //const [selectedRegularPlace, setSelectedRegularPlace] = useState(null);

  useFocusEffect(
    useCallback(() => {
      // Clear reserve state when entering the reservation flow
      setReserve(null);
    }, [setReserve]),
  );

  useEffect(() => {
    const url = getURL() + "/api/places";

    const token = auth;

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
        console.log("error al obtener lugares", error);
        //redireccionar a home con aviso de que lo intente de nuevo
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (place === defaultPlace && selectedRegularPlace === null) {
      Alert.alert("Error", "Debes seleccionar un punto de partida");
      return;
    }

    let placeToSave;

    if (isPlaceEmpty()) {
      placeToSave = selectedRegularPlace;
    } else {
      placeToSave = place;
    }

    console.log("lugar de inicio a guardar", placeToSave);

    const newReserve = {
      ...reserve,
      placeStart: placeToSave,
    };

    setReserve(newReserve);

    router.navigate("home/reserve-trip/register-place-end");
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Reserva un viaje</Text>
        <Text style={styles.subtitle}>Elegí un punto de partida</Text>
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
        <Button title="Continuar" onPress={handleContinuar} />
      </View>
    </ScrollView>
  );
}
