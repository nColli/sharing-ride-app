import { styles } from "../../../utils/styles";
import { useTrip } from "./TripContext";
import { View, Text, Button, Appearance } from "react-native";
import { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useRouter } from "expo-router";

export default function SelectTimeStart() {
  const [timeStart, setTimeStart] = useState(new Date());
  const [dateStart, setDateStart] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();
  const { trip, setTrip } = useTrip();

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
    const newDateStart = dateStart; //como es un hook creo una copia

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
    <View style={styles.container}>
      <Text style={styles.title}>Registra tu recorrido</Text>
      <Text style={styles.label}>Selecciona la hora del viaje:</Text>
      <Button
        title={formatTime(timeStart)}
        onPress={() => setShowTimePicker(true)}
      />
      <DateTimePickerModal
        isVisible={showTimePicker}
        time={timeStart}
        mode="time"
        onConfirm={onChangeTime}
        onCancel={() => setShowTimePicker(false)}
        isDarkModeEnabled={Appearance.getColorScheme() === "light"}
      />
      <Text style={styles.label}>Selecciona la fecha del viaje:</Text>
      <Button
        title={formatDate(dateStart)}
        onPress={() => setShowDatePicker(true)}
      />
      <DateTimePickerModal
        isVisible={showDatePicker}
        time={dateStart}
        mode="date"
        onConfirm={onChangeDate}
        onCancel={() => setShowDatePicker(false)}
        isDarkModeEnabled={Appearance.getColorScheme() === "light"}
      />
      <Text style={styles.label}>¿Querés crear una rutina?</Text>
      <Button title="crear rutina" onPress={handleCrearRutina} />
      <Text>
        En el viaje rutinario, podrás seleccionar para que el viaje se repita
        cada semana los días seleccionados por vos
      </Text>
      <Button title="Continuar" onPress={handleContinuar} />
    </View>
  );
}
