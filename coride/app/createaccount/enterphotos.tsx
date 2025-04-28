import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView, Button, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const { width } = Dimensions.get('window');
const PHOTO_CONTAINER_SIZE = width * 0.4; // 40% del ancho de pantalla

export default function PhotoUploadScreen() {
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null]);
  const [uploading, setUploading] = useState(false);
  let texto = '';

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
      Alert.alert('Permisos requeridos', 'Necesitamos acceso a la cámara y galería para subir fotos');
    }
  };

  const handleTakePhoto = async (index: number) => {
    await requestPermissions();
    
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      const base64 = await convertUriToBase64(result.assets[0].uri);
      const newPhotos = [...photos];
      newPhotos[index] = base64;
      setPhotos(newPhotos);
    }
  };

  const handleSelectFromGallery = async (index: number) => {
    await requestPermissions();
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      const base64 = await convertUriToBase64(result.assets[0].uri);
      const newPhotos = [...photos];
      newPhotos[index] = base64;
      setPhotos(newPhotos);
    }
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos[index] = null;
    setPhotos(newPhotos);
  };

  const validatePhotos = () => {
    return photos.every(photo => photo !== null);
  };

  const convertUriToBase64 = async (uri: string) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64
      });
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error('Error converting URI to Base64:', error);
      return null;
    }
  };

  const createUser = async () => {
    console.log('creating user');
    
    const dni_frente = photos[0];
    const dni_dorso = photos[1];
    const selfie = photos[2];

    const dataSaved = await AsyncStorage.multiGet(['email', 'password', 'dni', 'nombre', 'apellido', 'fechaNacimiento', 'calle', 'numero', 'localidad', 'provincia'])
    console.log('dataSaved', dataSaved);

    console.log('email data', dataSaved[0][1]);
    
    const newUser = {
      email: dataSaved[0][1],
      password: dataSaved[1][1],
      dni: dataSaved[2][1],
      name: dataSaved[3][1],
      surname: dataSaved[4][1],
      birthDate: dataSaved[5][1],
      street: dataSaved[6][1],
      number: dataSaved[7][1],
      locality: dataSaved[8][1],
      province: dataSaved[9][1],
    };
    
    console.log('user sin fotos', newUser);
    /*
    newUser['dni_frente'] = dni_frente;
    newUser['dni_dorso'] = dni_dorso;
    newUser['selfie'] = selfie;
    */
    //crear usuario con email y contraseña - sin token en schema de newUsers
    //validar si usuario es valido con fotos subidas 
    //si es valido sacar de newUsers y ponerlo en users
    //backend - crear nuevo schema de newUser

    axios
      .post("https://backend-sharing-ride-app.onrender.com/api/users", newUser)
      .then((response) => {console.log('user created', response)})
      .catch((error) => {Alert.alert('Error', 'error al crear el usuario')})
  }

  const handleUpload = async () => {
    if (!validatePhotos()) {
      Alert.alert('Fotos incompletas', 'Debes subir las 3 fotos requeridas');
      return;
    }

    setUploading(true);
    try {
      // Logica de subida
      createUser()

      //Alert.alert('Éxito', 'Fotos subidas correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudieron subir las fotos');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text style={styles.title}>Subí tus fotos</Text>
        <Text style={styles.subtitle}>Requerimos 3 fotos, del frente y dorso de tu DNI y una foto tuya</Text>

        <View style={styles.photosContainer}>
          {photos.map((photo, index) => {
            let texto = '';
            index === 1 ? texto = "Frente del DNI" : 
            index === 2 ? texto = "Dorso del DNI" :
            index === 3 ? texto = "Selfie" : null

            return (
              <View key={index} style={styles.photoContainer}>
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
                      onPress={() => handleTakePhoto(index)}
                    >
                      <MaterialIcons name="photo-camera" size={32} color="#2c3e50" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleSelectFromGallery(index)}
                    >
                      <MaterialIcons name="photo-library" size={32} color="#2c3e50" />
                    </TouchableOpacity>
                  </View>
                )}
                <Text style={styles.photoLabel}>{texto}</Text>
              </View>
          )})}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={uploading ? 'Subiendo...' : 'Continuar'}
            onPress={handleUpload}
            disabled={uploading}
            color="#2c3e50"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 30,
    textAlign: 'center',
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  photoContainer: {
    width: PHOTO_CONTAINER_SIZE,
    height: PHOTO_CONTAINER_SIZE,
    marginBottom: 15,
    overflow: 'hidden', // Previene que el contenido se desborde
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  photoActions: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#bdc3c7',
    borderRadius: 10,
    backgroundColor: '#f5f6fa',
  },
  actionButton: {
    padding: 10,
    marginVertical: 5,
  },
  photoLabel: {
    textAlign: 'center',
    marginTop: 8,
    color: '#7f8c8d',
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#e74c3c',
    borderRadius: 15,
    padding: 5,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%'
  },
  
});