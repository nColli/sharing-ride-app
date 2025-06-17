import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Button,
  TextInput,
} from "react-native";
import { useState } from "react";
import { useTrip } from "./TripContext";
import { useAuth } from "../../AuthContext";
import { useRouter } from "expo-router";
import getUrl from "../../../utils/url";
import axios from "axios";
import KeyboardAwareContainer from "../../../components/KeyboardAwareContainer";

const InputOpinion = ({ handleOpinion, user }) => {
  console.log("user", user);

  const { trip } = useTrip();

  const textPlace = (place) => {
    return `${place.street} ${place.number}, ${place.city}`;
  };

  const routeUser = () => {
    const reserveUser = trip.bookings.find((reserve) => {
      console.log("--------------------------------");
      console.log("reserve", reserve);
      console.log("user", user);
      console.log("reserve.user", reserve.user);
      console.log("user._id", user._id);
      console.log("--------------------------------");
      return reserve.user === user._id;
    });
    console.log("reserveUser", reserveUser);
    return (
      <View style={styles.routeContainer}>
        <Text style={styles.label}>
          Desde: {textPlace(reserveUser.placeStart)}
        </Text>
        <Text style={styles.label}>
          Hasta: {textPlace(reserveUser.placeEnd)}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.infoContainer}>
      <Text style={styles.sectionTitle}>
        Opinión de {user.name} {user.surname}
      </Text>
      {routeUser()}

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { trip } = useTrip();
  const { auth } = useAuth();
  const router = useRouter();
  const [opinions, setOpinions] = useState([]);

  const handleOpinion = (opinion, userTo) => {
    console.log(opinion, userTo);

    const prevOpinions = opinions;

    let opinionExists = false;
    prevOpinions.map((opinionSaved) => {
      if (opinionSaved.userTo === userTo) {
        opinionSaved.opinion = opinion;
        opinionExists = true;
      }
    });

    if (!opinionExists) {
      prevOpinions.push({ userTo, opinion });
    }

    setOpinions(prevOpinions);
  };

  const handleFinalizarViaje = async () => {
    setLoading(true);

    //enviar opiniones al servidor, para que marque el viaje como finalzado
    try {
      const body = {
        opinions,
      };

      const url = getUrl() + "/api/trips/finish/" + trip._id;

      const response = await axios.put(url, body, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      });

      console.log(response.data);

      router.push("/home");
    } catch (error) {
      console.log("Error al finalizar el viaje:", error);
      setError("Error al finalizar el viaje");
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
    <KeyboardAwareContainer contentContainerStyle={styles.container}>
      <Text style={styles.title}>Finalizar viaje</Text>
      {trip.usersTo.map((user) => {
        console.log("user", user);
        return (
          <InputOpinion
            key={user._id}
            user={user}
            handleOpinion={(opinion) => handleOpinion(opinion, user._id)}
          />
        );
      })}

      <Text style={styles.sectionTitle}>Datos de la transferencia</Text>
      <Text style={styles.info}>
        Para abonar la comisión del viaje, transfiera el monto al siguiente
        alias con el motivo indicado en la transferencia
      </Text>
      <View style={styles.transferInfo}>
        <Text style={styles.transferLabel}>Alias Transferencia:</Text>
        <Text style={styles.transferValue}>{trip.alias}</Text>
      </View>
      <View style={styles.transferInfo}>
        <Text style={styles.transferLabel}>Monto:</Text>
        <Text style={styles.transferValue}>${trip.tripFee}</Text>
      </View>
      <View style={styles.transferInfo}>
        <Text style={styles.transferLabel}>Motivo (DNI suyo):</Text>
        <Text style={styles.transferValue}>{trip.motivo}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Finalizar viaje" onPress={handleFinalizarViaje} />
      </View>
    </KeyboardAwareContainer>
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
    marginTop: 20,
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
  routeContainer: {
    marginBottom: 10,
  },
  transferInfo: {
    flexDirection: "row",
    marginBottom: 5,
  },
  transferLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: 5,
  },
  transferValue: {
    fontSize: 16,
    flex: 1,
  },
});
