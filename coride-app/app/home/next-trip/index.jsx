import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../AuthContext";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import getNextTrip from "../../../utils/getNextTrip";
import getNextReserve from "../../../utils/getNextReserve";
import getUrlTrip from "../../../utils/getUrlTrip.js";
import getTrips from "../../../utils/getTrips.js";
import getTripCost from "../../../utils/getTripCost.js";

export default function NextTrip() {
  const [loading, setLoading] = useState(true);
  const [isDriver, setIsDriver] = useState(false);
  const [trip, setTrip] = useState(null);
  const [reserve, setReserve] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const { auth } = useAuth();
  const [ruta, setRuta] = useState("");
  const [tripCost, setTripCost] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const token = auth;

      try {
        const getCantTrips = await getTrips(token);

        if (getCantTrips.length > 0) {
          setIsDriver(true);

          const nextTrip = await getNextTrip(token);

          if (nextTrip) {
            setTrip(nextTrip);
            const rutaTrip = await getUrlTrip(nextTrip._id, token);
            setRuta(rutaTrip.urlRuta);
            setTripCost(nextTrip.tripCost);
          } else {
            setError("No hay viajes próximos.");
          }
        } else {
          const nextReserve = await getNextReserve(token);

          const nextTripId = nextReserve.trip;
          console.log("nextTripId", nextTripId);

          if (nextReserve) {
            setReserve(nextReserve);
            const tripCost = await getTripCost(token, nextTripId);
            setTripCost(tripCost);
          } else {
            setError("No hay reservas próximas.");
          }
        }
      } catch (error) {
        console.log("Error al obtener array de viajes", error);
        setError("No hay viajes o reservas próximos.");
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

  if (!trip && !reserve) {
    return (
      <View style={styles.container}>
        <Text>No hay viajes o reservas próximos.</Text>
      </View>
    );
  }

  const displayData = isDriver ? trip : reserve;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isDriver ? "Próximo Viaje" : "Próxima Reserva"}
      </Text>
      <View style={styles.infoContainer}>
        <View style={styles.dateRow}>
          <Text style={styles.label}>Fecha:</Text>
          <Text style={styles.value}>
            {format(new Date(displayData.dateStart), "yyyy/MM/dd")}
          </Text>
        </View>

        <View style={styles.timeRow}>
          <Text style={styles.label}>Hora inicio:</Text>
          <Text style={styles.value}>
            {format(new Date(displayData.dateStart), "HH:mm a", { locale: es })}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Ruta del viaje:</Text>
        <View style={styles.locationRow}>
          <Text style={styles.label}>Origen:</Text>
          <Text style={styles.value}>
            {displayData.placeStart?.name ||
              displayData.placeStart?.street +
                " " +
                displayData.placeStart?.number +
                " " +
                displayData.placeStart?.city +
                " " +
                displayData.placeStart?.province}
          </Text>
        </View>

        <View style={styles.locationRow}>
          <Text style={styles.label}>Destino:</Text>
          <Text style={styles.value}>
            {displayData.placeEnd?.name ||
              displayData.placeEnd?.street +
                " " +
                displayData.placeEnd?.number +
                " " +
                displayData.placeEnd?.city +
                " " +
                displayData.placeEnd?.province}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          {isDriver ? "Cada pasajero debe pagarte:" : "Deberás pagar:"}
        </Text>
        <Text style={styles.costValue}>$ {tripCost || "-"}</Text>

        {isDriver && (
          <Text style={styles.sectionTitle}>
            Pasajeros confirmados: {trip.bookings?.length || 0}
          </Text>
        )}

        {!isDriver && (
          <Text style={styles.info}>
            El pago lo arreglás con el conductor por el chat o al momento de
            terminar el viaje
          </Text>
        )}

        {isDriver && (
          <Pressable
            onPress={() => Linking.openURL(ruta)}
            style={styles.pressable}
          >
            <Text style={styles.textPressable}>Ruta por google maps</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.chatButton}
          onPress={() => {
            const tripId = isDriver ? trip._id : reserve.trip;
            router.push(`/home/chat/${tripId}`);
          }}
        >
          <Text style={styles.chatButtonText}>Acceder al chat</Text>
        </Pressable>

        <Pressable
          style={styles.deleteButton}
          onPress={() => {
            const tripId = isDriver ? trip._id : reserve.trip;
            router.push(`/home/delete-trip/${tripId}`);
          }}
        >
          <Text style={styles.deleteButtonText}>Eliminar viaje</Text>
        </Pressable>

        <Pressable
          style={styles.backButton}
          onPress={() => {
            router.push("/home");
          }}
        >
          <Text style={styles.backButtonText}>Volver</Text>
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
  chatButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  chatButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    backgroundColor: "#8E8E93",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  passengerCount: {
    marginTop: 2,
    fontSize: 13,
    color: "#333",
  },
});
