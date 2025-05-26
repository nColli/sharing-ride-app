import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState, useLayoutEffect } from "react";
import { useAuth } from "../../AuthContext";
import axios from "axios";
import getUrl from "../../../utils/url";
import deleteTrip from "../../../utils/deleteTrip";
import deleteReserve from "../../../utils/deleteReserve";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useNavigation } from "@react-navigation/native";

export default function DeleteTrip() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { auth } = useAuth();
  const [trip, setTrip] = useState(null);
  const [isDriver, setIsDriver] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tripCost, setTripCost] = useState("0");

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Eliminar viaje`,
    });
  }, [navigation, id]);

  useEffect(() => {
    const fetchReserve = async () => {
      try {
        const reserveResponse = await axios.get(
          `${getUrl()}/api/reserves/${id}`,
          {
            headers: {
              Authorization: `Bearer ${auth}`,
            },
          },
        );
        console.log("reserva", reserveResponse.data);
        const tripCost = reserveResponse.data.trip.tripCost;
        setTripCost(tripCost);
        setTrip(reserveResponse.data);
      } catch (error) {
        console.error("Error al obtener la reserva", error);
        router.back();
      }
    };

    const fetchTrip = async () => {
      try {
        // get user para comprobar si es driver o pasajero
        const userResponse = await axios.get(`${getUrl()}/api/user/`, {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        });

        // get trip para obtener informacion del viaje
        const tripResponse = await axios.get(`${getUrl()}/api/trips/${id}`, {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        });
        if (tripResponse.data) {
          setTrip(tripResponse.data);
          // determinar si el usuario es el mismo que el driver del viaje, si no es, es pasajero
          const userIsDriver =
            tripResponse.data.driver._id === userResponse.data._id;

          setIsDriver(userIsDriver);

          if (!userIsDriver) {
            fetchReserve();
          } else {
            setTripCost(tripResponse.data.tripCost);
          }
        }
      } catch (error) {
        console.error("Error al obtener el viaje", error);
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async () => {
    if (isDriver) {
      await deleteTrip(id, auth);
    } else {
      await deleteReserve(id, auth);
    }
    Alert.alert("Viaje eliminado", "El viaje ha sido eliminado correctamente", [
      {
        text: "OK",
        onPress: () => router.push("/home"),
      },
    ]);
  };

  if (loading || !trip) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eliminar Viaje</Text>
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

        <Text style={styles.sectionTitle}>Ruta para buscar pasajeros:</Text>
        <View style={styles.locationRow}>
          <Text style={styles.label}>Lugar:</Text>
          <Text style={styles.value}>
            {trip.placeStart?.street} {trip.placeStart?.number},{" "}
            {trip.placeStart?.city}
          </Text>
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.label}>Hora:</Text>
          <Text style={styles.value}>
            {format(new Date(trip.dateStart), "HH:mm a", { locale: es })}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Ruta para dejar pasajeros:</Text>
        <View style={styles.locationRow}>
          <Text style={styles.label}>Lugar:</Text>
          <Text style={styles.value}>
            {trip.placeEnd?.street} {trip.placeEnd?.number},{" "}
            {trip.placeEnd?.city}
          </Text>
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.label}>Hora:</Text>
          <Text style={styles.value}>
            {format(new Date(trip.dateStart), "HH:mm a", { locale: es })}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          {isDriver ? "Cada pasajero debe pagarte:" : "Costo del viaje:"}
        </Text>
        <Text style={styles.costValue}>$ {tripCost}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Eliminar" onPress={handleDelete} color="#FF3B30" />
        <Button title="Volver" onPress={() => router.back()} />
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
  costRow: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  costValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
  },
  buttonContainer: {
    gap: 10,
  },
});
