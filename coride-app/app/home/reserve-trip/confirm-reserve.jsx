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
  const { reserve, setReserve } = useReserve();
  const router = useRouter();
  const [reserveFinded, setReserveFinded] = useState(false);

  function getPrecioViaje() {
    if (reserve.tripCost === undefined) {
      return "0";
    } else {
      return reserve.tripCost;
    }
  }

  const confirmarReserva = () => {
    const url = getUrl();
    const token = auth;

    const urlConfirmacion = url + "/api/reserves/confirm";
    console.log("url para confirmar reserva", urlConfirmacion);

    axios
      .patch(urlConfirmacion, reserve, {
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
      Alert.alert("Error", "No se ha encontrado una reserva pruebe más tarde");
      router.push("/home");
    };

    //enviar viaje registrado al servidor, si encuentra un viaje mostrar texto de encontrado, sino ir directo a home con mensae de Alert
    const url = getUrl();
    const token = auth;

    const urlRequest = url + "/api/reserves";

    axios
      .post(urlRequest, reserve, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const res = response.data;
        if (res.error) {
          reserveNotCompleted();
        } else if (reserve.isRoutine) {
          setReserveFinded(true);
          setReserve(res.reserves);
        } else {
          setReserveFinded(true);
          const reserves = [];
          reserves = reserves.concat(res.reserve);
          setReserve(reserves);

          if (res.message) {
            console.log("mensaje del servidor", res.message);
            Alert.alert(
              "Alerta",
              "No se han podido reservas todos los viajes, revise en la pestaña de proximos viajes",
            );
          }
        }
      })
      .catch((error) => {
        console.log("error al conseguir reserva");
        Alert.alert("Error", "Error al buscar reservas, intentelo más tarde");

        router.push("/home");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
