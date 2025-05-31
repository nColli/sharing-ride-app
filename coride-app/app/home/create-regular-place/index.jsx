import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { useAuth } from "../../AuthContext";
import getUrl from "../../../utils/url";
import { PROVINCES } from "../../../utils/provinces";
import { Picker } from "@react-native-picker/picker";

const AddRegularPlace = () => {
  const router = useRouter();
  const { auth } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    street: "",
    number: "",
    city: "",
    province: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const { name, street, number, city, province } = formData;

    if (!name.trim()) return "El nombre es obligatorio";
    if (!street.trim()) return "La dirección es obligatoria";
    if (!number.trim()) return "El número es obligatorio";
    if (!city.trim()) return "La ciudad es obligatoria";
    if (!province.trim()) return "La provincia es obligatoria";

    return null;
  };

  const handleSubmit = async () => {
    const errorMessage = validateForm();

    if (errorMessage) {
      Alert.alert("Error", errorMessage);
      return;
    }

    submitForm();
  };

  const submitForm = async () => {
    setLoading(true);

    try {
      console.log("form data", formData);

      const token = auth;

      console.log("token para lugar regular", token);

      const apiUrl = getUrl() + "/api/places";

      const response = await axios.post(apiUrl, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("response", response.data);

      Alert.alert("Éxito", "Lugar agregado correctamente", [
        { text: "OK", onPress: () => router.push("/home") },
      ]);
    } catch (error) {
      console.log("error", error);
      Alert.alert(
        "Error",
        "No se pudo agregar el lugar. Inténtelo nuevamente.",
        [{ text: "OK" }],
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Registrar Nuevo Lugar</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre:</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => handleChange("name", text)}
              placeholder="Nombre del lugar"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Calle:</Text>
            <TextInput
              style={styles.input}
              value={formData.street}
              onChangeText={(text) => handleChange("street", text)}
              placeholder="Nombre de la calle"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Número:</Text>
            <TextInput
              style={styles.input}
              value={formData.number}
              onChangeText={(text) => handleChange("number", text)}
              keyboardType="numeric"
              placeholder="Número"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Localidad:</Text>
            <TextInput
              style={styles.input}
              value={formData.city}
              onChangeText={(text) => handleChange("city", text)}
              placeholder="Ciudad o localidad"
            />
          </View>

          <Text style={styles.label}>Provincia</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.province}
              onValueChange={(itemValue) => handleChange("province", itemValue)}
            >
              <Picker.Item label="Seleccione una provincia" value="" />
              {PROVINCES.map((prov) => (
                <Picker.Item key={prov} label={prov} value={prov} />
              ))}
            </Picker>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Guardar Lugar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    borderColor: "#bdc3c7",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: "500",
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default AddRegularPlace;
