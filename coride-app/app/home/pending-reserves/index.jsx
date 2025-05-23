import {
  View,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
  Button,
} from "react-native";
import axios from "axios";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useRouter } from "expo-router";
import { useAuth } from "../../AuthContext";
import { useEffect, useState } from "react";
import getUrl from "../../../utils/url";
import { styles } from "../../../utils/styles";

export default function PendingReserves() {
  const { auth } = useAuth();
  const [reserves, setReserves] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const url = getUrl();
    const token = auth;

    const urlP = url + "/api/reserves";

    axios
      .get(urlP, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        //console.log("reserves", response.data);
        setReserves(response.data);
      })
      .catch((error) => {
        console.log("error", error);
        Alert.alert(
          "Error",
          "No ha sido posible obtener las reservas pendientes",
        );
        router.push("/home");
      });
  }, []);

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Reservas pendientes</Text>
        {reserves.map((reserve) => (
          <ContainerTrip key={reserve._id} reserve={reserve} />
        ))}
        <Button title="Volver" onPress={() => router.push("/home")} />
      </View>
    </ScrollView>
  );
}
const ContainerTrip = ({ reserve }) => {
  const router = useRouter();

  const handleChatAccess = () => {
    router.push("/home/chat/" + reserve._id);
  };

  const handleDeleteReserve = () => {
    router.push("/home/delete/" + reserve._id);
  };

  return (
    <View style={styles.tripContainer}>
      <View style={styles.tripHeader}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
          Estado: {reserve.status}
        </Text>
        <View style={styles.datePassengers}>
          <Text style={styles.dateText}>
            Fecha: {format(new Date(reserve.dateStart), "yyyy / MM / dd")}
          </Text>
        </View>
        <Text style={styles.timeText}>
          Hora inicio:{" "}
          {format(new Date(reserve.dateStart), "hh:mm a", { locale: es })}
        </Text>
      </View>

      <View style={styles.locations}>
        <Text style={styles.locationText}>
          Desde: {reserve.placeStart?.street} {reserve.placeStart?.number},{" "}
          {reserve.placeStart?.city}
        </Text>
        <Text style={styles.locationText}>
          Hacia: {reserve.placeEnd?.street} {reserve.placeEnd?.number},{" "}
          {reserve.placeEnd?.city}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.chatButton} onPress={handleChatAccess}>
          <Text style={styles.buttonText}>Acceder al chat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteReserve}
        >
          <Text style={styles.buttonText}>Eliminar reserva</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
