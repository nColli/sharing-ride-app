import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
import axios from "axios";
import getUrl from "../../../utils/url";
import { useRouter } from "expo-router";

export default function NextTrip() {
  const [loading, setLoading] = useState(true);
  const [isDriver, setIsDriver] = useState(false);
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        // Check if user has a vehicle
        const vehicleRes = await axios.get(`${getUrl()}/api/vehicles`);
        if (vehicleRes.data && vehicleRes.data.vehicle) {
          setIsDriver(true);
          // Fetch first trip for driver
          const tripRes = await axios.get(`${getUrl()}/api/trips/first`);
          setTrip(tripRes.data.trip);
        } else {
          setIsDriver(false);
          // Fetch first reserve for passenger
          const reserveRes = await axios.get(`${getUrl()}/api/reserves/first`);
          setTrip(reserveRes.data.reserve);
        }
      } catch (_err) {
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={styles.centered}>
        <Text>No hay viajes o reservas próximos.</Text>
      </View>
    );
  }

  if (isDriver) {
    // Driver UI
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Próximo Viaje</Text>
        <View style={styles.row}>
          <Text>Fecha: </Text>
          <Text>{trip.dateStart ? trip.dateStart.split("T")[0] : "-"}</Text>
          <Text> Hora inicio: </Text>
          <Text>
            {trip.dateStart ? trip.dateStart.split("T")[1]?.slice(0, 5) : "-"}
          </Text>
        </View>
        <Text>Origen:</Text>
        <Text>
          {trip.placeStart && trip.placeStart.name ? trip.placeStart.name : "-"}
        </Text>
        <Text>Destino:</Text>
        <Text>
          {trip.placeEnd && trip.placeEnd.name ? trip.placeEnd.name : "-"}
        </Text>
        <Text style={styles.payText}>Cada pasajero debe pagarte:</Text>
        <Text style={styles.amount}>$ {trip.tripCost || "-"}</Text>
        <Button
          title="Acceder al chat"
          onPress={() => {
            /* Navegar al chat */
          }}
        />
        <Button
          title="Eliminar viaje"
          color="#d00"
          onPress={() => {
            /* Eliminar viaje */
          }}
        />
        <Button
          title="Volver"
          onPress={() => {
            router.push("/home");
          }}
        />
      </ScrollView>
    );
  } else {
    // Passenger UI
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Próximo Viaje</Text>
        <View style={styles.row}>
          <Text>Fecha: </Text>
          <Text>{trip.dateStart ? trip.dateStart.split("T")[0] : "-"}</Text>
          <Text> Hora inicio: </Text>
          <Text>
            {trip.dateStart ? trip.dateStart.split("T")[1]?.slice(0, 5) : "-"}
          </Text>
        </View>
        <Text>Dirección de origen:</Text>
        <Text>
          {trip.placeStart && trip.placeStart.name ? trip.placeStart.name : "-"}
        </Text>
        <Text>Dirección de destino:</Text>
        <Text>
          {trip.placeEnd && trip.placeEnd.name ? trip.placeEnd.name : "-"}
        </Text>
        <View style={styles.row}>
          <Text>Deberás pagar: </Text>
          <Text style={styles.amount}>$ {trip.tripCost || "-"}</Text>
        </View>
        <Text style={styles.info}>
          El pago lo arreglás con el conductor por el chat o al momento de
          terminar el viaje
        </Text>
        <Button
          title="Acceder al chat"
          onPress={() => {
            /* Navegar al chat */
          }}
        />
        <Button
          title="Eliminar viaje"
          color="#d00"
          onPress={() => {
            /* Eliminar viaje */
          }}
        />
        <Button
          title="Volver"
          onPress={() => {
            /* Volver */
          }}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "stretch",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontWeight: "bold",
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  payText: {
    marginTop: 10,
  },
  amount: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  link: {
    color: "#1976d2",
    textDecorationLine: "underline",
    marginBottom: 10,
  },
  info: {
    marginVertical: 10,
    fontSize: 13,
    color: "#333",
  },
});
