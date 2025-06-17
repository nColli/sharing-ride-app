import { styles } from "../../../utils/styles";
import { useTrip } from "./TripContext";
import {
  View,
  Text,
  Button,
  Appearance,
  StyleSheet,
  Pressable,
} from "react-native";
import { useState, useEffect } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useRouter } from "expo-router";
import KeyboardAwareContainer from "../../../components/KeyboardAwareContainer";

export default function SelectTimeStart() {
  const [timeStart, setTimeStart] = useState(new Date());
  const [dateStart, setDateStart] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();
  const { trip, setTrip } = useTrip();

  // Initialize dates from trip context if available and valid
  useEffect(() => {
    if (
      trip?.date &&
      trip.date instanceof Date &&
      !isNaN(trip.date.getTime())
    ) {
      setDateStart(trip.date);
      setTimeStart(trip.date);
    }
  }, [trip]);

  const onChangeTime = (event) => {
    setShowTimePicker(false);

    console.log("onChangeTime", event);

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

    console.log("onChangeDate", event);

    if (event) {
      setDateStart(event);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("es-AR");
  };

  const handleCrearRutina = () => {
    router.navigate("home/register-trip/register-routine");
  };

  const handleContinuar = () => {
    //Guardar en useTrip
    //SI ES RUTINA SE GUARDA EN RUTINA CON UNA VARIABLE isRoutine en true para que server cree la rutina (crear los x objetos hasta que se llegue a la fecha)
    console.log("fecha y hora elegida", timeStart, dateStart);

    //poner en dateStart las horas y minutos elegidos en timeStart
    const newDateStart = new Date(dateStart); //create a proper copy

    newDateStart.setHours(timeStart.getHours());
    newDateStart.setMinutes(timeStart.getMinutes());

    const newTrip = {
      ...trip,
      date: newDateStart,
    };

    console.log("new trip en seleccionar fecha y hora", newTrip);

    setTrip(newTrip);

    router.navigate("home/register-trip/register-pick-distance");
  };

  return (
    <KeyboardAwareContainer>
      <View style={localStyles.container}>
        <Text style={localStyles.title}>Registra tu recorrido</Text>

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
    </KeyboardAwareContainer>
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
