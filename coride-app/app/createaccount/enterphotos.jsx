import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Button,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import { styles } from "../../utils/styles";
import { useAuth } from "../AuthContext";
import { useUser } from "./UserContext";

import LoadingOverlay from "../../components/LoadingOverlay";
import useLoading from "../../custom_hooks/useLoading";
import getUrl from "../../utils/url";

const { width } = Dimensions.get("window");
const PHOTO_CONTAINER_SIZE = width * 0.4; // 40% del ancho de pantalla

export default function PhotoUploadScreen() {
  const { isLoading, withLoading } = useLoading();

  const [photos, setPhotos] = useState([null, null, null]);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const { setAuth } = useAuth();
  const { user } = useUser();

  console.log("user", user);

  const requestPermissions = async () => {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== "granted" || libraryStatus !== "granted") {
      Alert.alert(
        "Permisos requeridos",
        "Necesitamos acceso a la cámara y galería para subir fotos",
      );
    }
  };

  const handleImageSelection = async (index, useCamera) => {
    await requestPermissions();

    const options = {
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    };

    const result = useCamera
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled && result.assets[0].uri) {
      const newPhotos = [...photos];
      newPhotos[index] = result.assets[0].uri;
      setPhotos(newPhotos);
    }
  };

  const handleRemovePhoto = (index) => {
    const newPhotos = [...photos];
    newPhotos[index] = null;
    setPhotos(newPhotos);
  };

  const saveUserData = async (response) => {
    const authToken = response.data.tokenLogin;

    console.log("token", authToken);

    setAuth(authToken);
  };

  const handleUpload = async () => {
    if (!photos.every((photo) => photo !== null)) {
      Alert.alert("Error", "Debes subir todas las fotos requeridas");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();

      // Agregar datos del usuario como JSON
      const userData = {
        email: user.email,
        password: user.password,
        dni: user.dni,
        name: user.nombre,
        surname: user.apellido,
        birthDate: user.fechaNacimiento,
        street: user.address.street,
        number: user.address.number,
        city: user.address.locality,
        province: user.address.province,
      };

      formData.append("userData", JSON.stringify(userData));

      // Agregar archivos de imagen
      formData.append("dni_frente", {
        uri: photos[0],
        name: "dni_frente.jpg",
        type: "image/jpeg",
      });

      formData.append("dni_dorso", {
        uri: photos[1],
        name: "dni_dorso.jpg",
        type: "image/jpeg",
      });

      formData.append("selfie", {
        uri: photos[2],
        name: "selfie.jpg",
        type: "image/jpeg",
      });

      const baseUrl = getUrl();

      await withLoading(
        axios
          .post(`${baseUrl}/api/users`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            saveUserData(response);
          }),
      );

      Alert.alert(
        "Ya tenes tu cuenta",
        "Tu usuario ha sido creado, podes empezar a usar la app",
        [
          {
            text: "OK",
            onPress: () => router.push("/home"),
          },
        ],
      );
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Hubo un problema al crear el usuario", [
        {
          text: "OK",
          onPress: () => router.push("/"),
        },
      ]);
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text style={styles.title}>Subí tus fotos</Text>
        <Text style={styles.subtitle}>
          Requerimos 3 fotos, del frente y dorso de tu DNI y una foto tuya
        </Text>

        <View style={styles.photosContainer}>
          {photos.map((photo, index) => {
            const labels = ["Frente del DNI", "Dorso del DNI", "Selfie"];
            return (
              <View key={index} style={stylesLocal.photoContainer}>
                {photo ? (
                  <>
                    <Image source={{ uri: photo }} style={styles.photo} />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemovePhoto(index)}
                    >
                      <MaterialIcons name="close" size={24} color="white" />
                    </TouchableOpacity>
                  </>
                ) : (
                  <View style={styles.photoActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleImageSelection(index, true)}
                    >
                      <MaterialIcons
                        name="photo-camera"
                        size={32}
                        color="#2c3e50"
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleImageSelection(index, false)}
                    >
                      <MaterialIcons
                        name="photo-library"
                        size={32}
                        color="#2c3e50"
                      />
                    </TouchableOpacity>
                  </View>
                )}
                <Text style={styles.photoLabel}>{labels[index]}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={uploading ? "Subiendo..." : "Continuar"}
            onPress={handleUpload}
            disabled={uploading}
            color="#2c3e50"
          />
        </View>

        <LoadingOverlay visible={isLoading} />
      </View>
    </ScrollView>
  );
}

const stylesLocal = StyleSheet.create({
  photoContainer: {
    width: PHOTO_CONTAINER_SIZE,
    height: PHOTO_CONTAINER_SIZE,
    marginBottom: 15,
    overflow: "hidden", // Previene que el contenido se desborde
  },
});
