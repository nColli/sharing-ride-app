import { useEffect, useState } from "react";
import getURL from "../../../utils/url";
import axios from "axios";
import { View, Text, TextInput, Button } from "react-native";
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

    console.log('token', token);


    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setRegularPlaces(response.data);
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

  const handleContinuar = () => {
    //guardar datos en hook
    const newTrip = {
      ...trip,
      placeEnd: place,
    };

    setTrip(newTrip);

    router.navigate("/home/register-trip/register-start-time");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registra tu recorrido</Text>
      <Text style={styles.subtitle}>Elegi un punto de destino</Text>
      <Picker
        selectedValue={selectedRegularPlace}
        onValueChange={(itemValue, itemIndex) =>
          setSelectedRegularPlace(itemValue)
        }
      >
        {regularPlaces.map((place, idx) => (
          <Picker.Item key={idx} label={place.name} value={place} />
        ))}
      </Picker>
      <Text>Calle:</Text>
      <TextInput style={styles.input} onChangeText={handleChangeCalle} />
      <Text>Numero:</Text>
      <TextInput style={styles.input} onChangeText={handleChangeNumero} />
      <Text>Localidad:</Text>
      <TextInput style={styles.input} onChangeText={handleChangeLocalidad} />

      {/* AGREGAR SELECCIONADOR DE PROVINCIAS, LISTA EXTRAERLA EN UTILITY Y VER DE HACER COMPONENTE PERSONALIZADO, ENVIANDOLE LOS HOOKS */}
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
  );
}
