import { View, Text, TextInput, ScrollView } from "react-native";
import { styles } from "../utils/styles";
import { useEffect } from "react";
import getURL from "../utils/url";
import axios from "axios";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { PROVINCES } from "../utils/provinces";

export default function SelectPlace({ place, setPlace, token }) {

  const [regularPlaces, setRegularPlaces] = useState([]);
  const [selectedRegularPlace, setSelectedRegularPlace] = useState(null);

  useEffect(() => {
    const url = getURL() + "/api/places";
    
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
    if (place.city === "" || place.province === "" || place.street === "" || place.number === "") {
      return false;
    }
    return true;
  }

  return (
    <ScrollView>
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
    </ScrollView>
  );
}