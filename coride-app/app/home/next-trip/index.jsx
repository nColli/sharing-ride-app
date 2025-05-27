import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import axios from "axios";
import getUrl from "../../../utils/url";
import { useRouter } from "expo-router";
import { useAuth } from "../../AuthContext";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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

          const nextReserveWithCost = {
            ...nextReserve,
            tripCost: tripOfNextReserve.data.tripCost,
          };

          setReserve(nextReserveWithCost);
          setTrip(tripOfNextReserve.data);
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
        <Text>No hay viajes o reservas próximos.</Text>
      </View>
    );
  }

  const displayData = isDriver ? trip : reserve;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Próximo Viaje</Text>
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
            {displayData.placeStart?.name || "-"}
          </Text>
        </View>

        <View style={styles.locationRow}>
          <Text style={styles.label}>Destino:</Text>
          <Text style={styles.value}>{displayData.placeEnd?.name || "-"}</Text>
        </View>

        <Text style={styles.sectionTitle}>
          {isDriver ? "Cada pasajero debe pagarte:" : "Deberás pagar:"}
        </Text>
        <Text style={styles.costValue}>$ {displayData.tripCost || "-"}</Text>

        {!isDriver && (
          <Text style={styles.info}>
            El pago lo arreglás con el conductor por el chat o al momento de
            terminar el viaje
          </Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Acceder al chat"
          onPress={() => {
            router.push(`/home/chat/${trip._id}`);
          }}
        />
        <Button
          title="Eliminar viaje"
          color="#FF3B30"
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
    gap: 10,
  },
  info: {
    marginTop: 10,
    fontSize: 13,
    color: "#333",
  },
});
