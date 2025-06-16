import { View, Text, Button, Appearance, Alert } from "react-native";
import { useTrip } from "./TripContext";
import { useRouter } from "expo-router";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useState } from "react";
import { styles } from "../../../utils/styles";
import { MultiSelect } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";

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
    <View style={styles.container}>
      <Text style={styles.title}>Registrar rutina</Text>

      <Text style={styles.label}>Fecha de inicio de la rutina</Text>
      <Button
        title={formatDate(dateStart)}
        onPress={() => setShowDatePickerStart(true)}
      />
      <DateTimePickerModal
        isVisible={showDatePickerStart}
        date={dateStart}
        mode="date"
        onConfirm={onChangeDateStart}
        onCancel={() => setShowDatePickerStart(false)}
        isDarkModeEnabled={Appearance.getColorScheme() === "light"}
      />

      <Text style={styles.label}>Fecha de fin de la rutina</Text>
      <Button
        title={formatDate(dateEnd)}
        onPress={() => setShowDatePickerEnd(true)}
      />
      <DateTimePickerModal
        isVisible={showDatePickerEnd}
        date={dateEnd}
        mode="date"
        onConfirm={onChangeDateEnd}
        onCancel={() => setShowDatePickerEnd(false)}
        isDarkModeEnabled={Appearance.getColorScheme() === "light"}
      />

      <Text style={styles.label}>Selecciona la hora del viaje:</Text>
      <Button
        title={formatTime(timeStart)}
        onPress={() => setShowTimePicker(true)}
      />
      <DateTimePickerModal
        isVisible={showTimePicker}
        date={timeStart}
        mode="time"
        onConfirm={onChangeTime}
        onCancel={() => setShowTimePicker(false)}
        isDarkModeEnabled={Appearance.getColorScheme() === "light"}
      />

      <View style={styles.dropdownContainer}>
        <MultiSelect
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
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
              style={styles.icon}
              color="black"
              name="Safety"
              size={20}
            />
          )}
          selectedStyle={styles.selectedStyle}
        />
      </View>

      <Button title="Continuar" onPress={handleRegistrarDistancia} />
    </View>
  );
}
