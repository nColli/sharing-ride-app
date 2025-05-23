import { View, Text, Button, Appearance } from "react-native";
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

  const onChangeDateStart = (event) => {
    setShowDatePickerStart(false);

    if (event) {
      setDateStart(event);
    }
  };

  const onChangeDateEnd = (event) => {
    setShowDatePickerEnd(false);

    if (event) {
      setDateEnd(event);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("es-AR");
  };

  const handleRegistrarDistancia = () => {
    //guardar en trip
    const newTrip = {
      ...trip,
      dateStart: dateStart,
      dateEnd: dateEnd,
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
        time={dateStart}
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
        time={dateEnd}
        mode="date"
        onConfirm={onChangeDateEnd}
        onCancel={() => setShowDatePickerEnd(false)}
        isDarkModeEnabled={Appearance.getColorScheme() === "light"}
      />

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
        placeholder="Select item"
        searchPlaceholder="Search..."
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

      <Button title="Continuar" onPress={handleRegistrarDistancia} />
    </View>
  );
}
