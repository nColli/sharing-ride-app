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
          <ContainerTrip key={reserve._id} trip={reserve} />
        ))}
        <Button title="Volver" onPress={() => router.push("/home")} />
      </View>
    </ScrollView>
  );
}
const ContainerTrip = ({ trip }) => {
  const router = useRouter();

  const handleChatAccess = () => {
    router.push("/home/chat/" + trip._id);
  };

  const handleDeleteTrip = () => {
    router.push("/home/delete/" + trip._id);
  };

  return (
    <View style={styles.tripContainer}>
      <View style={styles.tripHeader}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            💲{trip.tripCost}
          </Text>
          <View style={styles.datePassengers}>
            <Text style={styles.dateText}>
              Fecha: {format(new Date(trip.dateStart), "yyyy / MM / dd")}
            </Text>
            <Text style={styles.passengersText}>
              Pasajeros: {trip.bookings ? trip.bookings.length : 0}
            </Text>
          </View>
        </View>
        <Text style={styles.timeText}>
          Hora inicio:{" "}
          {format(new Date(trip.dateStart), "hh:mm a", { locale: es })}
        </Text>
      </View>

      <View style={styles.locations}>
        <Text style={styles.locationText}>
          Desde: {trip.placeStart.street} {trip.placeStart.number},{" "}
          {trip.placeStart.city}
        </Text>
        <Text style={styles.locationText}>
          Hacia: {trip.placeEnd.street} {trip.placeEnd.number},{" "}
          {trip.placeEnd.city}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.chatButton} onPress={handleChatAccess}>
          <Text style={styles.buttonText}>Acceder al chat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteTrip}
        >
          <Text style={styles.buttonText}>Eliminar viaje</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
