import { useState } from "react";
import { View, Text, Button, Alert, ScrollView } from "react-native";
import { styles } from "../../../utils/styles";
import SelectPlace from "../../../components/SelectPlace";
import { useReserve } from "./ReserveContext";
import { useAuth } from "../../AuthContext";
import { useRouter } from "expo-router";

export default function SelectPlaceStart() {
  const defaultPlace = {
    name: "",
    street: "",
    number: "",
    city: "",
    province: "",
  };

  const [place, setPlace] = useState(defaultPlace);
  const { auth } = useAuth();
  const router = useRouter();

  //guardar lugar de partida en context de reserve-trip
  const { reserve, setReserve } = useReserve();

  const handleContinuar = () => {
    if (place === null) {
      Alert.alert("Error", "Debes seleccionar un punto de partida");
      return;
    }

    const newReserve = {
      ...reserve,
      placeEnd: place,
    };

    setReserve(newReserve);

    router.navigate("home/reserve-trip/register-time-start");
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Reserva un viaje</Text>
        <Text style={styles.subtitle}>Elegí un punto de destino</Text>
        <SelectPlace token={auth} setPlace={setPlace} place={place} />
        <Button title="Continuar" onPress={handleContinuar} />
      </View>
    </ScrollView>
  );
}
