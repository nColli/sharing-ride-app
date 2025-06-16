import { styles } from "../../../utils/styles";
import { useReserve } from "./ReserveContext";
import { View, Text, Button, Appearance, Alert } from "react-native";
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
    <View style={styles.container}>
      <Text style={styles.title}>Registra tu reserva</Text>
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
      <Text style={styles.label}>Selecciona la fecha del viaje:</Text>
      <Button
        title={formatDate(dateStart)}
        onPress={() => setShowDatePicker(true)}
      />
      <DateTimePickerModal
        isVisible={showDatePicker}
        date={dateStart}
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
