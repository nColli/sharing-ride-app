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
import { useAuth } from "../../AuthContext";

const findNextTrip = (trips) => {
  if (!trips || trips.length === 0) return null;

  return trips.reduce((earliest, current) => {
    if (!earliest) return current;
    if (!current.dateStart) return earliest;
    return new Date(current.dateStart) < new Date(earliest.dateStart)
      ? current
      : earliest;
  }, null);
};

export default function NextTrip() {
  const [loading, setLoading] = useState(true);
  const [isDriver, setIsDriver] = useState(false);
  const [trip, setTrip] = useState(null);
  const [reserve, setReserve] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const { auth } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      const token = auth;
      try {
        // si usuario es conductor, busco el proximo viaje donde sea conductor
        const vehicleRes = await axios.get(`${getUrl()}/api/vehicles`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (vehicleRes.data) {
          setIsDriver(true);
          const tripRes = await axios.get(`${getUrl()}/api/trips/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const trips = tripRes.data;
          const nextTrip = findNextTrip(trips);
          setTrip(nextTrip);
        }

        //si no es conductor, busco proxima reserva O si no tiene ningun viaje como conductor pendiente
        if (!vehicleRes.data || vehicleRes.data.length === 0) {
          setIsDriver(false);
          const reserveRes = await axios.get(`${getUrl()}/api/reserves/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const reserves = reserveRes.data;
          const nextReserve = findNextTrip(reserves); //es el mismo algoritmo aunque sea reserva

          const tripOfNextReserve = await axios.get(
            `${getUrl()}/api/trips/${nextReserve.trip}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          setReserve(nextReserve);
          setTrip(tripOfNextReserve.data); //lo uso igual porque si es reserva muestro UI diferente
        }
      } catch (_err) {
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            router.push(`/home/chat/${trip._id}`);
          }}
        />
        <Button
          title="Eliminar viaje"
          color="#d00"
          onPress={() => {
            router.push(`/home/delete-trip/${trip._id}`);
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
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Próximo Viaje</Text>
        <View style={styles.row}>
          <Text>Fecha: </Text>
          <Text>
            {reserve.dateStart ? reserve.dateStart.split("T")[0] : "-"}
          </Text>
          <Text> Hora inicio: </Text>
          <Text>
            {reserve.dateStart
              ? reserve.dateStart.split("T")[1]?.slice(0, 5)
              : "-"}
          </Text>
        </View>
        <Text>Dirección de origen:</Text>
        <Text>
          {reserve.placeStart && reserve.placeStart.name
            ? reserve.placeStart.name
            : "-"}
        </Text>
        <Text>Dirección de destino:</Text>
        <Text>
          {reserve.placeEnd && reserve.placeEnd.name
            ? reserve.placeEnd.name
            : "-"}
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
            router.push(`/home/chat/${trip._id}`);
          }}
        />
        <Button
          title="Eliminar viaje"
          color="#d00"
          onPress={() => {
            router.push(`/home/delete-reserve/${trip._id}`);
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
