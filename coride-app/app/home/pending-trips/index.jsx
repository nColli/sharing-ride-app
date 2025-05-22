import { View, Text, TouchableOpacity, ScrollView, Button } from "react-native";
import { useRouter } from "expo-router";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAuth } from "../../AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import getURL from "../../../utils/url";
import { styles } from "../../../utils/styles";

export default function PendingTrips() {
  const { auth } = useAuth();
  const apiUrl = getURL();
  const [trips, setTrips] = useState([]);
  const router = useRouter();

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/trips`, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      })
      .then((response) => {
        setTrips(response.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Viajes pendientes</Text>
        {trips.map((trip) => (
          <ContainerTrip key={trip._id} trip={trip} />
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
        <View style={styles.datePassengers}>
          <Text style={styles.dateText}>
            Fecha: {format(new Date(trip.dateStart), "yyyy / MM / dd")}
          </Text>
          <Text style={styles.passengersText}>
            Pasajeros: {trip.bookings ? trip.bookings.length : 0}
          </Text>
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
