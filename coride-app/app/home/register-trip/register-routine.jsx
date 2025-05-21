import { View, Text, Button, TextInput } from "react-native";
import { useTrip } from "./TripContext";
import { useRouter } from "expo-router";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Appearance } from "react-native";

export default function RegisterRoutine() {
  const { trip, setTrip } = useTrip();
  const router = useRouter();
  const [showDatePickerStart, setShowDatePickerStart] = useState(false);
  const [showDatePickerEnd, setShowDatePickerEnd] = useState(false);
  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());

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
    };

    setTrip(newTrip);

    router.navigate("home/register-trip/register-pick-distance");
  };

  return (
    <View>
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

      <Button title="Continuar" onPress={handleRegistrarDistancia} />
    </View>
  );
}