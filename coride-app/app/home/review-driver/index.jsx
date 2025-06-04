import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Button,
  TextInput,
} from "react-native";
import { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import { useRouter } from "expo-router";
import getUrl from "../../../utils/url";
import axios from "axios";
import getPendingReview from "../../../utils/getPendingReview";

const InputOpinion = ({ handleOpinion, driver, reserve }) => {
  const textPlace = (place) => {
    return `${place.street} ${place.number}, ${place.city}`;
  };

  const routeUser = () => {
    return (
      <View>
        <Text style={styles.label}>Desde: {textPlace(reserve.placeStart)}</Text>
        <Text style={styles.label}>Hasta: {textPlace(reserve.placeEnd)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.infoContainer}>
      <Text style={styles.sectionTitle}>
        Opinión de {driver.name} {driver.surname}
      </Text>
      {routeUser()}
      <Text style={styles.label}>
        Fecha:{" "}
        {new Date(reserve.dateStart).toLocaleString("es-AR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>

      <TextInput
        style={styles.input}
        numberOfLines={1}
        onChangeText={handleOpinion}
        placeholder="Escribí tu opinión aquí..."
      />
    </View>
  );
};

export default function NextTrip() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { auth } = useAuth();
  const router = useRouter();
  const [opinion, setOpinion] = useState("");
  const [driver, setDriver] = useState(null);
  const [reserve, setReserve] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = auth;
      const { reserve, driver } = await getPendingReview(token);
      console.log("reserve", reserve);
      console.log("driver", driver);
      if (reserve && driver) {
        setDriver(driver);
        setReserve(reserve);
      } else {
        setError("No hay una revisión pendiente");
      }
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpinion = (newOpinion) => {
    setOpinion(newOpinion);
  };

  const handleReviewDriver = async () => {
    setLoading(true);

    //enviar opiniones al servidor, para que marque el viaje como finalzado
    try {
      const opinionToSend = {
        userTo: driver.id,
        opinion: opinion,
      };

      const url = getUrl() + "/api/trips/review-driver/" + reserve.trip._id; //reserve.trip es el ID del viaje

      console.log("opinionToSend", opinionToSend);
      console.log("url", url);

      const response = await axios.put(url, opinionToSend, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      });

      console.log(response.data);

      router.push("/home");
    } catch (error) {
      console.log("Error al evaluar el conductor:", error);
      setError("Error al evaluar el conductor");
    } finally {
      setLoading(false);
    }
  };

  //para cuando usuario presione finalizar viaje
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
      <Text style={styles.title}>Evaluar conductor</Text>
      <InputOpinion
        driver={driver}
        reserve={reserve}
        handleOpinion={handleOpinion}
      />

      <View style={styles.buttonContainer}>
        <Button title="Evaluar conductor" onPress={handleReviewDriver} />
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
    marginBottom: 10,
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
  pressable: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  textPressable: {
    color: "white",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
});
