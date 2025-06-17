import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Button,
  Pressable,
} from "react-native";
import { useEffect, useState } from "react";
import { useTrip } from "./TripContext";
import { useAuth } from "../../AuthContext";
import getNextTrip from "../../../utils/getNextTrip";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useRouter } from "expo-router";
import getTrips from "../../../utils/getTrips";

export default function NextTrip() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { trip, setTrip } = useTrip();
  const { auth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getCantTrips = await getTrips(auth);

        if (getCantTrips.length > 0) {
          const nextTrip = await getNextTrip(auth);

          if (nextTrip) {
            setTrip(nextTrip);
          } else {
            setError(
              "No hay viajes programados como conductor para dentro de una hora o menos",
            );
          }
        } else {
          setError(
            "No hay viajes programados como conductor para dentro de una hora o menos",
          );
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setError(
          "No hay viajes programados como conductor para dentro de una hora o menos",
        );
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Próximo Viaje</Text>
      <View style={styles.infoContainer}>
        <View style={styles.dateRow}>
          <Text style={styles.label}>Fecha:</Text>
          <Text style={styles.value}>
            {format(new Date(trip.dateStart), "yyyy/MM/dd")}
          </Text>
        </View>

        <View style={styles.timeRow}>
          <Text style={styles.label}>Hora inicio:</Text>
          <Text style={styles.value}>
            {format(new Date(trip.dateStart), "HH:mm a", { locale: es })}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Ruta del viaje:</Text>
        <View style={styles.locationRow}>
          <Text style={styles.label}>Origen:</Text>
          <Text style={styles.value}>
            {trip.placeStart?.name ||
              trip.placeStart?.street +
                " " +
                trip.placeStart?.number +
                " " +
                trip.placeStart?.city +
                " " +
                trip.placeStart?.province}
          </Text>
        </View>

        <View style={styles.locationRow}>
          <Text style={styles.label}>Destino:</Text>
          <Text style={styles.value}>
            {trip.placeEnd?.name ||
              trip.placeEnd?.street +
                " " +
                trip.placeEnd?.number +
                " " +
                trip.placeEnd?.city +
                " " +
                trip.placeEnd?.province}
          </Text>
        </View>

        <Text style={styles.sectionTitle}> Cada pasajero debe pagarte: </Text>
        <Text style={styles.costValue}>$ {trip.tripCost || "-"}</Text>

        <Text style={styles.sectionTitle}>
          Pasajeros a recoger: {trip.bookings?.length || 0}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.startButton}
          onPress={() => {
            router.push(`/home/start-trip/start-route`);
          }}
        >
          <Text style={styles.startButtonText}>Iniciar viaje</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  },
  infoContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
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
  dateRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  timeRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  locationRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: 10,
    minWidth: 100,
  },
  value: {
    fontSize: 16,
    flex: 1,
  },
  costValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
  },
  buttonContainer: {
    gap: 15,
  },
  startButton: {
    backgroundColor: "#34C759",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  startButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  info: {
    marginTop: 10,
    fontSize: 13,
    color: "#333",
  },
  pressable: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  textPressable: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  passengerCount: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 10,
    marginBottom: 10,
  },
});
