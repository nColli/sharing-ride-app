import { styles } from "../../../utils/styles";
import { useReserve } from "./ReserveContext";
import {
  View,
  Text,
  Button,
  Appearance,
  Alert,
  StyleSheet,
  Pressable,
} from "react-native";
import { useState, useEffect } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useRouter } from "expo-router";
import { createReserve } from "../../../utils/createReserve";
import { useAuth } from "../../AuthContext";

export default function SelectTimeStart() {
  const [timeStart, setTimeStart] = useState(new Date());
  const [dateStart, setDateStart] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();
  const { reserve, setReserve } = useReserve();
  const { auth } = useAuth();

  // Initialize dates from reserve context if available and valid
  useEffect(() => {
    if (
      reserve?.date &&
      reserve.date instanceof Date &&
      !isNaN(reserve.date.getTime())
    ) {
      setDateStart(reserve.date);
      setTimeStart(reserve.date);
    }
  }, [reserve]);

  const onChangeTime = (event) => {
    setShowTimePicker(false);

    if (event) {
      setTimeStart(event);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const onChangeDate = (event) => {
    setShowDatePicker(false);

    if (event) {
      setDateStart(event);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("es-AR");
  };

  const handleCrearRutina = () => {
    router.navigate("home/reserve-trip/register-routine");
  };

  const handleContinuar = async () => {
    console.log("fecha y hora elegida", timeStart, dateStart);

    const copyDateStart = new Date(dateStart); // create a proper copy
    copyDateStart.setHours(timeStart.getHours());
    copyDateStart.setMinutes(timeStart.getMinutes());

    console.log("copyDateStart:", copyDateStart);

    const newReserve = {
      ...reserve,
      date: copyDateStart,
      isRoutine: false,
    };

    //hacer petición a server para crear la reserva, si es rutina, se creaen register-routine
    const responseServer = await createReserve(newReserve, auth);

    if (responseServer === null) {
      //si es null es xq no se ha encontrado reservas o hay error en el servidor
      //se asume que no se ha encontrado reservas
      Alert.alert("Reserva no registrada", "No se ha encontrado reservas", [
        {
          texto: "Ok",
          onPress: () => router.navigate("/home"),
        },
      ]);
      return;
    } else {
      const newReserveServer = responseServer.reserve;
      console.log("newReserveServer", newReserveServer);
      setReserve(newReserveServer);
      router.navigate("home/reserve-trip/confirm-reserve");
    }
  };

  return (
    <View style={localStyles.container}>
      <Text style={localStyles.title}>Registra tu reserva</Text>

      <View style={localStyles.infoContainer}>
        <Text style={localStyles.sectionTitle}>Horario del viaje</Text>

        <View style={localStyles.timeRow}>
          <Text style={localStyles.label}>Hora:</Text>
          <Pressable
            style={localStyles.timeButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={localStyles.timeButtonText}>
              {formatTime(timeStart)}
            </Text>
          </Pressable>
        </View>

        <View style={localStyles.timeRow}>
          <Text style={localStyles.label}>Fecha:</Text>
          <Pressable
            style={localStyles.timeButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={localStyles.timeButtonText}>
              {formatDate(dateStart)}
            </Text>
          </Pressable>
        </View>

        <DateTimePickerModal
          isVisible={showTimePicker}
          date={timeStart}
          mode="time"
          onConfirm={onChangeTime}
          onCancel={() => setShowTimePicker(false)}
          isDarkModeEnabled={Appearance.getColorScheme() === "light"}
        />
        <DateTimePickerModal
          isVisible={showDatePicker}
          date={dateStart}
          mode="date"
          onConfirm={onChangeDate}
          onCancel={() => setShowDatePicker(false)}
          isDarkModeEnabled={Appearance.getColorScheme() === "light"}
        />
      </View>

      <View style={localStyles.routineContainer}>
        <Text style={localStyles.sectionTitle}>
          ¿Querés crear una rutina?
        </Text>
        <Text style={localStyles.description}>
          En el viaje rutinario, podrás seleccionar para que el viaje se
          repita cada semana los días seleccionados por vos
        </Text>

        <Pressable
          style={localStyles.routineButton}
          onPress={handleCrearRutina}
        >
          <Text style={localStyles.routineButtonText}>Crear rutina</Text>
        </Pressable>
      </View>

      <View style={localStyles.buttonContainer}>
        <Pressable
          style={localStyles.continueButton}
          onPress={handleContinuar}
        >
          <Text style={localStyles.continueButtonText}>Continuar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
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
    color: "#333",
  },
  infoContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
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
  routineContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: 15,
    minWidth: 60,
    color: "#333",
  },
  timeButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
  },
  timeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 15,
  },
  routineButton: {
    backgroundColor: "#34C759",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  routineButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonContainer: {
    marginTop: 10,
  },
  continueButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
