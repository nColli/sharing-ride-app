import { View, Text, Button, Alert } from "react-native";
import { useEffect } from "react";
import { styles } from "../../../utils/styles";
import deleteReserve from "../../../utils/deleteReserve";
import { useAuth } from "../../AuthContext";
import getUrl from "../../../utils/url";
import axios from "axios";
import { useReserve } from "./ReserveContext";
import { useRouter } from "expo-router";
import getReserve from "../../../utils/getReserve";

export default function ConfirmReserve() {
  const { auth } = useAuth();
  const { reserve, setReserve } = useReserve();
  const router = useRouter();

  useEffect(() => {
    //obt reserva con datos de trips y trip completos para informar costo
    (async function () {
      console.log("reserve._id", reserve._id);
      const completeReserve = await getReserve(reserve._id, auth);
      console.log("completeReserve", completeReserve);
      setReserve(completeReserve);
    })();
  }, []);

  const eliminarReservaPendiente = async () => {
    await deleteReserve(reserve._id, auth);

    Alert.alert("Reserva cancelada", "La reserva ha sido cancelada", [
      {
        texto: "Ok",
        onPress: () => router.navigate("/home"),
      },
    ]);
  };

  const confirmarReserva = () => {
    const url = getUrl();
    const token = auth;

    const urlConfirmacion = url + "/api/reserves/confirm";
    console.log("url para confirmar reserva", urlConfirmacion);

    const reserves = [reserve];

    axios
      .patch(urlConfirmacion, reserves, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        Alert.alert("Exito", "Reserva confirmada con exito", [
          {
            texto: "Ok",
            onPress: () => router.navigate("/home"),
          },
        ]);
      })
      .catch((error) => {
        console.log("error al confirmar reserva", error);
        eliminarReservaPendiente();
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Confirma tu reserva!</Text>
      <Text style={styles.label}>
        Nuestro sistema ha encontrado un conductor con el que podés ir. la hora
        estipulada, la aplicación te informará cuando esté cerca. cerca. También
        tenés un chat para hablar con el.
      </Text>
      <Text>Costo del viaje</Text>
      <Text>{reserve.trip.tripCost ? reserve.trip.tripCost : "0"}</Text>
      <Button title="Confirmar reserva" onPress={confirmarReserva} />
      <Button title="Eliminar reserva" onPress={eliminarReservaPendiente} />
    </View>
  );
}
