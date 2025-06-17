import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, Appearance } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { styles } from "../../utils/styles";
import { useUser } from "./UserContext";
import { PROVINCES } from "../../utils/provinces";
import KeyboardAwareContainer from "../../components/KeyboardAwareContainer";

export default function Insertpersonaldata() {
  const [dni, setDni] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [locality, setLocality] = useState("");
  const [province, setProvince] = useState("");
  const [errors, setErrors] = useState({
    street: "",
    number: "",
    locality: "",
    province: "",
  });
  const { user, setUser } = useUser();
  const router = useRouter();

  const handleDni = (text) => {
    setDni(text);
  };

  const handleNombre = (text) => {
    setNombre(text);
  };

  const handleApellido = (text) => {
    setApellido(text);
  };

  const onChangeFecha = (event) => {
    setShowDatePicker(false);
    if (event) {
      setFechaNacimiento(event);
    }
  };

  // Formatear fecha para mostrar (ej: "15/05/1990")
  const formatDate = (date) => {
    return date.toLocaleDateString("es-AR");
  };

  const validateStreet = (text) => {
    const regex = /^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]{3,}$/;
    return regex.test(text);
  };

  const validateNumber = (text) => {
    const regex = /^\d{1,6}$/;
    return regex.test(text) && parseInt(text) > 0;
  };

  const validateLocality = (text) => {
    const regex = /^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]{3,}$/;
    return regex.test(text);
  };

  const validateForm = () => {
    const newErrors = {
      street: "",
      number: "",
      locality: "",
      province: "",
    };

    if (!validateStreet(street)) {
      newErrors.street = "Calle inválida (mínimo 3 caracteres)";
    }

    if (!validateNumber(number)) {
      newErrors.number = "Número inválido (solo números positivos)";
    }

    if (!validateLocality(locality)) {
      newErrors.locality = "Localidad inválida";
    }

    if (!province) {
      newErrors.province = "Seleccione una provincia";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSignup = async () => {
    if (!dni || !nombre || !apellido || !fechaNacimiento || !validateForm()) {
      Alert.alert("Error", "Complete todos los campos");
      return;
    }

    const address = {
      street,
      number,
      locality,
      province,
    };

    const newUser = {
      ...user,
      dni,
      nombre,
      apellido,
      fechaNacimiento: fechaNacimiento.toISOString(),
      address,
    };

    console.log("newUser", newUser);

    setUser(newUser);

    router.navigate("createaccount/enterphotos");
  };

  return (
    <KeyboardAwareContainer>
      <Text style={styles.title}>¡Registra tu cuenta!</Text>

      <Text style={styles.label}>DNI</Text>
      <TextInput
        style={styles.input}
        placeholder="11.111.111"
        value={dni}
        onChangeText={handleDni}
        keyboardType="default"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        placeholder="Juan"
        value={nombre}
        onChangeText={handleNombre}
        keyboardType="default"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Text style={styles.label}>Apellido</Text>
      <TextInput
        style={styles.input}
        placeholder="Perez"
        value={apellido}
        onChangeText={handleApellido}
        keyboardType="default"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Text style={styles.sectionTitle}>Fecha de Nacimiento</Text>
      <Button
        title={formatDate(fechaNacimiento)}
        onPress={() => setShowDatePicker(true)}
      />

      <DateTimePickerModal
        isVisible={showDatePicker}
        date={fechaNacimiento}
        mode="date"
        onConfirm={onChangeFecha}
        onCancel={() => setShowDatePicker(false)}
        isDarkModeEnabled={Appearance.getColorScheme() === "light"}
      />

      <Text style={styles.sectionTitle}>Dirección</Text>

      <Text style={styles.label}>Calle</Text>
      <TextInput
        style={[styles.input, errors.street && styles.errorInput]}
        placeholder="Ej: Av. Rivadavia"
        value={street}
        onChangeText={setStreet}
      />
      {errors.street && <Text style={styles.errorText}>{errors.street}</Text>}

      <Text style={styles.label}>Número</Text>
      <TextInput
        style={[styles.input, errors.number && styles.errorInput]}
        placeholder="Ej: 1234"
        value={number}
        onChangeText={setNumber}
        keyboardType="number-pad"
      />
      {errors.number && <Text style={styles.errorText}>{errors.number}</Text>}

      <Text style={styles.label}>Localidad</Text>
      <TextInput
        style={[styles.input, errors.locality && styles.errorInput]}
        placeholder="Ej: San Miguel"
        value={locality}
        onChangeText={setLocality}
      />
      {errors.locality && (
        <Text style={styles.errorText}>{errors.locality}</Text>
      )}

      <Text style={styles.label}>Provincia</Text>
      <View
        style={[styles.pickerContainer, errors.province && styles.errorInput]}
      >
        <Picker
          selectedValue={province}
          onValueChange={(itemValue) => setProvince(itemValue)}
        >
          <Picker.Item label="Seleccione una provincia" value="" />
          {PROVINCES.map((prov) => (
            <Picker.Item key={prov} label={prov} value={prov} />
          ))}
        </Picker>
      </View>
      {errors.province && (
        <Text style={styles.errorText}>{errors.province}</Text>
      )}

      <Button title="Continuar" onPress={handleSignup} />
    </KeyboardAwareContainer>
  );
}
