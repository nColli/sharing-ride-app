import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { styles } from "../../../utils/styles";
import { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useRouter, Link } from "expo-router";
import getUrlTrip from "../../../utils/getUrlTrip";
import getNextTrip from "../../../utils/getNextTrip";

export default function StartTrip() {
  const [loading, setLoading] = useState(true);
  const [trip, setTrip] = useState(null);
  const [reserves, setReserves] = useState([]);
  const [error, setError] = useState("");
  const router = useRouter();
  const { auth } = useAuth();
  const [ruta, setRuta] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const nextTrip = await getNextTrip(auth);
        console.log("nextTrip", nextTrip);

        if (!nextTrip) {
          setError("No hay ningún viaje próximo");
          return;
        }

        setTrip(nextTrip);
        setReserves(nextTrip.bookings || []);

        const rutaTrip = await getUrlTrip(nextTrip._id, auth);
        setRuta(rutaTrip.urlRuta);
        console.log("ruta", rutaTrip.urlRuta);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={styles.container}>
        <Text>No hay viajes programados para hoy.</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Iniciar Viaje</Text>
        <View style={styles.tripContainer}>
          <View style={styles.tripHeader}>
            <Text style={styles.dateText}>
              Fecha: {format(new Date(trip.dateStart), "yyyy/MM/dd")}
            </Text>
          </View>

          <View style={styles.locations}>
            <Text style={styles.locationText}>
              Hora inicio:
              {format(new Date(trip.dateStart), "HH:mm a", { locale: es })}
            </Text>
            <Text style={styles.sectionTitle}>Ruta para buscar pasajeros:</Text>
            <Text style={styles.locationText}>
              Lugar: {trip.placeStart.street} {trip.placeStart.number},
              {trip.placeStart.city}
            </Text>
            <Text style={styles.locationText}>
              Hora:{" "}
              {format(new Date(trip.dateStart), "HH:mm a", { locale: es })}
            </Text>

            {reserves.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Puntos de recogida:</Text>
                {reserves.map((reserve, index) => (
                  <Text key={reserve._id} style={styles.locationText}>
                    {index + 1}. {reserve.placeStart.street}
                    {reserve.placeStart.number},{reserve.placeStart.city}
                  </Text>
                ))}
              </>
            )}
          </View>

          <View style={styles.locations}>
            <Text style={styles.sectionTitle}>Ruta para dejar pasajeros:</Text>
            <Text style={styles.locationText}>
              Lugar: {trip.placeEnd.street} {trip.placeEnd.number},
              {trip.placeEnd.city}
            </Text>
            <Text style={styles.locationText}>
              Hora:{" "}
              {format(new Date(trip.dateStart), "HH:mm a", { locale: es })}
            </Text>
            {reserves.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Puntos de destino:</Text>
                {reserves.map((reserve, index) => (
                  <Text key={reserve._id} style={styles.locationText}>
                    {index + 1}. {reserve.placeEnd.street}
                    {reserve.placeEnd.number},{reserve.placeEnd.city}
                  </Text>
                ))}
              </>
            )}
          </View>

          <Text style={[styles.locationText, { marginTop: 10 }]}>
            Cada pasajero debe pagarte: $ {trip.tripCost}
          </Text>

          <Link href={ruta} style={[styles.chatButton, { marginTop: 10 }]}>
            <Text style={styles.buttonText}>Ruta por Google Maps</Text>
          </Link>

          <TouchableOpacity
            style={[styles.chatButton, { marginTop: 10 }]}
            onPress={() => router.push(`/home/chat/${trip._id}`)}
          >
            <Text style={styles.buttonText}>Acceder al chat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.deleteButton, { marginTop: 10 }]}
            onPress={() => {
              router.push("/home/delete-trip/" + trip._id);
            }}
          >
            <Text style={styles.buttonText}>Terminar Viaje</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.deleteButton,
              { marginTop: 10, backgroundColor: "#FF6B6B" },
            ]}
            onPress={() => router.push(`/home/delete-trip/${trip._id}`)}
          >
            <Text style={styles.buttonText}>Cancelar Viaje</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
