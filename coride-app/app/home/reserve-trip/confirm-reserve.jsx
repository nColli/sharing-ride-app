import { View, Text, Button, Alert, StyleSheet, Pressable } from "react-native";
import { useEffect, useState } from "react";
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
  const [reserves, setReserves] = useState([]);
  const router = useRouter();
  const [tripCost, setTripCost] = useState("0");

  useEffect(() => {
    //obt reserva con datos de trips y trip completos para informar costo
    (async function () {
      //verificar si es una rutina - si es, es un array de reservas, tomo la primera, sino es una reserva normal
      console.log("reserve en CONFIRMAR RESERVA", reserve);
      if (reserve?.savedReserves) {
        const completeReserve = await getReserve(
          reserve.savedReserves[0]._id,
          auth,
        );
        console.log("completeReserve", completeReserve);
        //setReserve(completeReserve);
        console.log("reserve.savedReserves", reserve.savedReserves);
        setReserves(reserve.savedReserves);
        setTripCost(completeReserve.trip.tripCost);
        return;
      } else {
        const completeReserve = await getReserve(reserve._id, auth);
        console.log("completeReserve", completeReserve);
        setReserves(reserves.concat(reserve));
        //setReserve(completeReserve);
        setTripCost(completeReserve.trip.tripCost);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const eliminarReservaPendiente = async () => {
    //eliminar array de reservas, si es una sola es una iteracion
    reserves.map(async (reserve) => {
      await deleteReserve(reserve._id, auth);
    });

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

    //const reserves = [reserve];

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
    <View style={localStyles.container}>
      <Text style={localStyles.title}>¡Confirma tu reserva!</Text>

      <View style={localStyles.infoContainer}>
        <Text style={localStyles.description}>
          Nuestro sistema ha encontrado un conductor con el que podés ir. A la
          hora estipulada, la aplicación te informará cuando esté cerca. También
          tenés un chat para hablar con él.
        </Text>

        <Text style={localStyles.sectionTitle}>Costo del viaje</Text>
        <Text style={localStyles.costValue}>$ {tripCost}</Text>

        <Text style={localStyles.info}>
          El pago lo arreglás con el conductor por el chat o al momento de
          terminar el viaje
        </Text>
      </View>

      <View style={localStyles.buttonContainer}>
        <Pressable style={localStyles.confirmButton} onPress={confirmarReserva}>
          <Text style={localStyles.confirmButtonText}>Confirmar reserva</Text>
        </Pressable>

        <Pressable
          style={localStyles.cancelButton}
          onPress={eliminarReservaPendiente}
        >
          <Text style={localStyles.cancelButtonText}>Eliminar reserva</Text>
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
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  costValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 15,
  },
  info: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 15,
  },
  confirmButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
