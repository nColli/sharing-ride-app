import { View, Text, TouchableOpacity, Linking } from "react-native";
import { styles } from "../../../utils/styles";
import { getUrlMaps } from "../../../utils/getUrlMaps";
import { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext";
import axios from "axios";
import getUrl from "../../../utils/url";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useRouter } from "expo-router";

export default function StartTrip() {
  const [loading, setLoading] = useState(true);
  const [trip, setTrip] = useState(null);
  const [reserves, setReserves] = useState([]);
  const [error, setError] = useState("");
  const router = useRouter();
  const { auth } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setError("");
      try {
        const vehicleRes = await axios.get(`${getUrl()}/api/vehicles`, {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        });

        if (!vehicleRes.data || vehicleRes.data.length === 0) {
          setError("No eres conductor");
          setLoading(false);
          return;
        }

        const tripRes = await axios.get(`${getUrl()}/api/trips/`, {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const currentTrip = tripRes.data.find((trip) => {
          const tripDate = new Date(trip.dateStart);
          tripDate.setHours(0, 0, 0, 0);
          return tripDate.getTime() === today.getTime();
        });

        if (!currentTrip) {
          setError("No hay viajes programados para hoy");
        } else {
          const tripDetailsRes = await axios.get(
            `${getUrl()}/api/reserves/trip/${currentTrip._id}`,
            {
              headers: {
                Authorization: `Bearer ${auth}`,
              },
            },
          );

          setTrip(tripDetailsRes.data);
          setReserves(tripDetailsRes.data.bookings || []);
        }
      } catch (err) {
        console.log(err);
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [auth]);

  const handleOpenMaps = () => {
    if (trip) {
      const tripStartLocation = `${trip.placeStart.street} ${trip.placeStart.number}, ${trip.placeStart.city}`;
      const tripEndLocation = `${trip.placeEnd.street} ${trip.placeEnd.number}, ${trip.placeEnd.city}`;

      const pickupLocations = reserves.map(
        (reserve) =>
          `${reserve.placeStart.street} ${reserve.placeStart.number}, ${reserve.placeStart.city}`,
      );

      const dropoffLocations = reserves.map(
        (reserve) =>
          `${reserve.placeEnd.street} ${reserve.placeEnd.number}, ${reserve.placeEnd.city}`,
      );

      const url = getUrlMaps(
        tripStartLocation,
        tripEndLocation,
        pickupLocations,
        dropoffLocations,
      );
      Linking.openURL(url);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
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
            Hora: {format(new Date(trip.dateStart), "HH:mm a", { locale: es })}
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
            Hora: {format(new Date(trip.dateStart), "HH:mm a", { locale: es })}
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

        <TouchableOpacity
          style={[
            styles.chatButton,
            { backgroundColor: "#4285F4", marginTop: 15 },
          ]}
          onPress={handleOpenMaps}
        >
          <Text style={styles.buttonText}>Ruta por Google Maps</Text>
        </TouchableOpacity>

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
  );
}
