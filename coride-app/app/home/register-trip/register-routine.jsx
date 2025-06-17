import {
  View,
  Text,
  Appearance,
  Alert,
  StyleSheet,
  Pressable,
} from "react-native";
import { useTrip } from "./TripContext";
import { useRouter } from "expo-router";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useState } from "react";
import { MultiSelect } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import KeyboardAwareContainer from "../../../components/KeyboardAwareContainer";

const data = [
  { label: "Domingo", value: "Sunday" },
  { label: "Lunes", value: "Monday" },
  { label: "Martes", value: "Tuesday" },
  { label: "Miercoles", value: "Wednesday" },
  { label: "Jueves", value: "Thursday" },
  { label: "Viernes", value: "Friday" },
  { label: "Sabado", value: "Saturday" },
];

export default function RegisterRoutine() {
  const { trip, setTrip } = useTrip();
  const router = useRouter();
  const [showDatePickerStart, setShowDatePickerStart] = useState(false);
  const [showDatePickerEnd, setShowDatePickerEnd] = useState(false);
  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());
  const [days, setDays] = useState([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timeStart, setTimeStart] = useState(new Date());

  const onChangeDateStart = (event) => {
    setShowDatePickerStart(false);

    console.log("change dateStart", event);

    if (event) {
      setDateStart(event);
    }
  };

  const onChangeTime = (event) => {
    setShowTimePicker(false);

    console.log("change time", event);

    if (event) {
      setTimeStart(event);
    }
  };

  const onChangeDateEnd = (event) => {
    setShowDatePickerEnd(false);

    console.log("change dateEnd", event);

    if (event) {
      setDateEnd(event);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("es-AR");
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRegistrarDistancia = () => {
    //guardar en trip
    //la hora y min de comienzo del viaje lo guardo en la hora y minutos de dateStart y dateEnd
    if (days.length === 0) {
      console.log("no selecciono ningun dia");

      Alert.alert(
        "Error",
        "Selecciona los dias que queres que se repita la rutina",
      );
      return;
    }

    const copyDateStart = dateStart;
    copyDateStart.setHours(timeStart.getHours());
    copyDateStart.setMinutes(timeStart.getMinutes());

    const copyDateEnd = dateEnd;
    copyDateEnd.setHours(timeStart.getHours());
    copyDateEnd.setMinutes(timeStart.getMinutes());

    const newTrip = {
      ...trip,
      dateStart: copyDateStart,
      dateEnd: copyDateEnd,
      isRoutine: true,
      days,
    };

    console.log("new trip", newTrip);

    setTrip(newTrip);

    router.navigate("home/register-trip/register-pick-distance");
  };

  return (
    <KeyboardAwareContainer>
      <View style={localStyles.container}>
        <Text style={localStyles.title}>Registrar rutina</Text>

        <View style={localStyles.daysContainer}>
          <Text style={localStyles.sectionTitle}>Días de la semana</Text>
          <Text style={localStyles.description}>
            Selecciona los días en los que quieres que se repita el viaje
          </Text>
          <MultiSelect
            style={localStyles.dropdown}
            placeholderStyle={localStyles.placeholderStyle}
            selectedTextStyle={localStyles.selectedTextStyle}
            inputSearchStyle={localStyles.inputSearchStyle}
            iconStyle={localStyles.iconStyle}
            search
            data={data}
            labelField="label"
            valueField="value"
            placeholder="Seleccionar días"
            searchPlaceholder="Buscar..."
            value={days}
            onChange={(item) => {
              setDays(item);
            }}
            renderLeftIcon={() => (
              <AntDesign
                style={localStyles.icon}
                color="black"
                name="Safety"
                size={20}
              />
            )}
            selectedStyle={localStyles.selectedStyle}
          />
        </View>

        <View style={localStyles.infoContainer}>
          <Text style={localStyles.sectionTitle}>Fecha de inicio de la rutina</Text>
          <Pressable
            style={localStyles.dateButton}
            onPress={() => setShowDatePickerStart(true)}
          >
            <Text style={localStyles.dateButtonText}>{formatDate(dateStart)}</Text>
          </Pressable>
          <DateTimePickerModal
            isVisible={showDatePickerStart}
            date={dateStart}
            mode="date"
            onConfirm={onChangeDateStart}
            onCancel={() => setShowDatePickerStart(false)}
            isDarkModeEnabled={Appearance.getColorScheme() === "light"}
          />

          <Text style={localStyles.sectionTitle}>Fecha de fin de la rutina</Text>
          <Pressable
            style={localStyles.dateButton}
            onPress={() => setShowDatePickerEnd(true)}
          >
            <Text style={localStyles.dateButtonText}>{formatDate(dateEnd)}</Text>
          </Pressable>
          <DateTimePickerModal
            isVisible={showDatePickerEnd}
            date={dateEnd}
            mode="date"
            onConfirm={onChangeDateEnd}
            onCancel={() => setShowDatePickerEnd(false)}
            isDarkModeEnabled={Appearance.getColorScheme() === "light"}
          />

          <Text style={localStyles.sectionTitle}>Selecciona la hora del viaje:</Text>
          <Pressable
            style={localStyles.dateButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={localStyles.dateButtonText}>{formatTime(timeStart)}</Text>
          </Pressable>
          <DateTimePickerModal
            isVisible={showTimePicker}
            date={timeStart}
            mode="time"
            onConfirm={onChangeTime}
            onCancel={() => setShowTimePicker(false)}
            isDarkModeEnabled={Appearance.getColorScheme() === "light"}
          />
        </View>

        <View style={localStyles.buttonContainer}>
          <Pressable
            style={localStyles.continueButton}
            onPress={handleRegistrarDistancia}
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
  daysContainer: {
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
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 15,
  },
  dateButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  dateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  dropdown: {
    height: 50,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#666",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#333",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  icon: {
    marginRight: 5,
  },
  selectedStyle: {
    borderRadius: 8,
    backgroundColor: "#E3F2FD",
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
