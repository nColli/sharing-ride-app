import { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { router } from "expo-router";

import LoadingOverlay from "../../../components/LoadingOverlay";
import useLoading from "../../../custom_hooks/useLoading";
import { useAuth } from "../../AuthContext";

const PhotoUpload = ({ label, photo, onPhotoChange }) => {
  const handleTakePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      onPhotoChange(result.assets[0].uri);
    }
  };

  const handleSelectFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      onPhotoChange(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.photoSection}>
      <Text style={styles.label}>{label}</Text>
      {photo ? (
        <View style={styles.photoContainer}>
          <Image source={{ uri: photo }} style={styles.photo} />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => onPhotoChange(null)}
          >
            <MaterialIcons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.photoActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleTakePhoto}
          >
            <MaterialIcons name="photo-camera" size={32} color="#2c3e50" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleSelectFromGallery}
          >
            <MaterialIcons name="photo-library" size={32} color="#2c3e50" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default function VehicleRegistration() {
  const { isLoading, withLoading } = useLoading();
  const { auth } = useAuth();

  const [formData, setFormData] = useState({
    patente: "",
    marca: "",
    modelo: "",
    año: "",
    capacidad: "",
    kilometros: "",
  });
  const [seguroFoto, setSeguroFoto] = useState(null);
  const [licenciaFoto, setLicenciaFoto] = useState(null);

  const handleSubmit = async () => {
    if (
      !Object.values(formData).every(Boolean) ||
      !seguroFoto ||
      !licenciaFoto
    ) {
      Alert.alert(
        "Error",
        "Completa todos los campos y sube las fotos requeridas",
      );
      return;
    }

    const data = new FormData();

    // Agregar datos del formulario
    const copyFormData = {
      patente: formData["patente"],
      marca: formData["marca"],
      modelo: formData["modelo"],
      anio: formData["año"],
      capacidad: formData["capacidad"],
      kilometros: formData["kilometros"],
    };

    data.append("vehicleData", JSON.stringify(copyFormData));

    // Agregar fotos
    if (seguroFoto) {
      data.append("seguro", {
        uri: seguroFoto,
        name: "seguro.jpg",
        type: "image/jpeg",
      });
    }

    if (licenciaFoto) {
      data.append("licencia", {
        uri: licenciaFoto,
        name: "licencia.jpg",
        type: "image/jpeg",
      });
    }

    //obtener token
    const token = auth;

    try {
      await withLoading(
        axios.post(
          "https://backend-sharing-ride-app.onrender.com/api/vehicles",
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          },
        ),
      );
      Alert.alert("Vehiculo registrado", "Vehículo registrado correctamente");

      router.navigate("/home");
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      Alert.alert("Error", "Verifique los datos ingresados");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registrar vehículo</Text>

      {Object.keys(formData).map((field) => (
        <View key={field}>
          <Text style={styles.label}>
            {field.charAt(0).toUpperCase() + field.slice(1).replace("_", " ")}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={`Ingrese ${field.replace("_", " ")}`}
            value={formData[field]}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, [field]: text }))
            }
            keyboardType={
              ["año", "capacidad", "kilometros"].includes(field)
                ? "numeric"
                : "default"
            }
            autoCapitalize={field === "patente" ? "characters" : "words"}
          />
        </View>
      ))}

      <PhotoUpload
        label="Foto del seguro del vehículo"
        photo={seguroFoto}
        onPhotoChange={setSeguroFoto}
      />

      <PhotoUpload
        label="Foto de la licencia de conducir"
        photo={licenciaFoto}
        onPhotoChange={setLicenciaFoto}
      />

      <View style={styles.buttonContainer}>
        <Button
          title="Registrar vehículo"
          onPress={handleSubmit}
          color="#2c3e50"
        />

        <LoadingOverlay visible={isLoading} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2c3e50",
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#2c3e50",
  },
  input: {
    height: 50,
    borderColor: "#bdc3c7",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  seguroContainer: {
    marginVertical: 15,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  checkboxLabel: {
    marginLeft: 10,
    color: "#7f8c8d",
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
  },
  photoSection: {
    marginVertical: 15,
  },
  photoContainer: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  photoActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    borderWidth: 2,
    borderColor: "#bdc3c7",
    borderRadius: 10,
    padding: 15,
    backgroundColor: "#f5f6fa",
  },
  removeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#e74c3c",
    borderRadius: 15,
    padding: 5,
  },
  actionButton: {
    padding: 10,
  },
});
