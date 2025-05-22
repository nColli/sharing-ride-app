import { View, Text, Button, Alert } from "react-native";
import { styles } from "../../../utils/styles";
import { useAuth } from "../../AuthContext";
import { useEffect, useState } from "react";
import getUrl from "../../../utils/url";
import axios from "axios";
import { useReserve } from "./ReserveContext";
import { useRouter } from "expo-router";

export default function ConfirmReserve() {
  const { auth } = useAuth();
  const { reserve } = useReserve();
  const router = useRouter();
  const [reserveTrip, setReserveTrip] = useState(reserve);
  const [reserveFinded, setReserveFinded] = useState(false);

  function getPrecioViaje() {
    if (reserveTrip === reserve) {
      return "0";
    } else {
      return reserveTrip.tripCost;
    }
  }

  const confirmarReserva = () => {
    const url = getUrl();
    const token = auth;

    const urlConfirmacion = url + "/api/reserve/" + reserveTrip.id;
    console.log("url para confirmar reserva", urlConfirmacion);

    const content = {
      status: "confirm",
    };

    axios
      .patch(urlConfirmacion, content, {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
      })
      .then((response) => {
        Alert.alert("Exito", "Reserva confirmada con exito");
        router.push("/home");
      });
  };

  useEffect(() => {
    const reserveNotCompleted = () => {
      router.push("/home");
    };

    //enviar viaje registrado al servidor, si encuentra un viaje mostrar texto de encontrado, sino ir directo a home con mensae de Alert
    const url = getUrl();
    const token = auth;

    const urlRequest = url + "/api/reserve";

    axios
      .post(urlRequest, reserve, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const res = response.data;
        if (!res.id) {
          reserveNotCompleted();
        } else {
          setReserveTrip(res);
          setReserveFinded(true);
        }
      })
      .catch((error) => {
        console.log("error al conseguir reserva");
        Alert.alert("Error", "Error al buscar reservas, intentelo más tarde");

        router.push("/home");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!reserveTrip.id) {
    return <View></View>;
  }
  /*
  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Reserva confirmada!</Text>
      <Text style={styles.label}>
        Nuestro sistema ha encontrado un conductor con el que podés ir. fecha a
        la hora estipulada, la aplicación te informará cuando esté cerca.
        También tenés un chat para hablar con el.
      </Text>
      <Text>Costo del viaje</Text>
      <Text>{getPrecioViaje()}</Text>
      <Button title="Confirmar reserva" onPress={confirmarReserva} />
    </View>
  );*/
  return (
    <View style={styles.container}>
      {reserveFinded && (
        <View>
          <Text style={styles.title}>¡Reserva confirmada!</Text>
          <Text style={styles.label}>
            Nuestro sistema ha encontrado un conductor con el que podés ir.
            fecha a la hora estipulada, la aplicación te informará cuando esté
            cerca. También tenés un chat para hablar con el.
          </Text>
          <Text>Costo del viaje</Text>
          <Text>{getPrecioViaje()}</Text>
          <Button title="Confirmar reserva" onPress={confirmarReserva} />
        </View>
      )}
    </View>
  );
}
