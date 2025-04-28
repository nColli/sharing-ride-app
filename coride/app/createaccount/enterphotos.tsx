import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView, Button, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosResponse } from 'axios';
import { useRouter } from 'expo-router';


const { width } = Dimensions.get('window');
const PHOTO_CONTAINER_SIZE = width * 0.4; // 40% del ancho de pantalla

export default function PhotoUploadScreen() {
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null]);
  const [uploading, setUploading] = useState(false);
  const router = useRouter()

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
      Alert.alert('Permisos requeridos', 'Necesitamos acceso a la cámara y galería para subir fotos');
    }
  };

  const handleImageSelection = async (index: number, useCamera: boolean) => {
    await requestPermissions();
    
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: 'images',
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

  const handleRemovePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos[index] = null;
    setPhotos(newPhotos);
  };

  const getUserData = async () => {
    const dataSaved = await AsyncStorage.multiGet([
      'email', 'password', 'dni', 'nombre', 
      'apellido', 'fechaNacimiento', 'calle', 
      'numero', 'localidad', 'provincia'
    ]);
    
    return {
      email: dataSaved[0][1] || '',
      password: dataSaved[1][1] || '',
      dni: dataSaved[2][1] || '',
      name: dataSaved[3][1] || '',
      surname: dataSaved[4][1] || '',
      birthDate: dataSaved[5][1] || '',
      street: dataSaved[6][1] || '',
      number: dataSaved[7][1] || '',
      city: dataSaved[8][1] || '',
      province: dataSaved[9][1] || '',
    };
  };

  const saveUserData = async (response: AxiosResponse<any>) => {
    const authToken = response.data.tokenLogin;

    console.log('token', authToken);

    await AsyncStorage.setItem('authToken', authToken).then(() => {
      console.log('email saved');
    }).catch(error => {
      console.log('error saving email', error);
    })

    await AsyncStorage.getItem('authToken').then(t => {console.log('token from async', t)})
      .catch((error) => {
        console.log('error getting item', error);
        return
      })
  }

  const handleUpload = async () => {
    if (!photos.every(photo => photo !== null)) {
      Alert.alert('Error', 'Debes subir todas las fotos requeridas');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      const userData = await getUserData();

      // Agregar datos del usuario como JSON
      formData.append('userData', JSON.stringify(userData));

      // Agregar archivos de imagen
      formData.append('dni_frente', {
        uri: photos[0],
        name: 'dni_frente.jpg',
        type: 'image/jpeg',
      } as any);

      formData.append('dni_dorso', {
        uri: photos[1],
        name: 'dni_dorso.jpg',
        type: 'image/jpeg',
      } as any);

      formData.append('selfie', {
        uri: photos[2],
        name: 'selfie.jpg',
        type: 'image/jpeg',
      } as any);

      const response = await axios.post(
        'https://backend-sharing-ride-app.onrender.com/api/users',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      Alert.alert('Éxito', 'Usuario creado y fotos subidas correctamente');
      console.log('Respuesta del servidor:', response.data);


      saveUserData(response)

      router.navigate('../home')

    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Hubo un problema al crear el usuario');
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
            const labels = ["Frente del DNI", "Dorso del DNI", "Selfie"];
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
                      onPress={() => handleImageSelection(index, true)}
                    >
                      <MaterialIcons name="photo-camera" size={32} color="#2c3e50" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleImageSelection(index, false)}
                    >
                      <MaterialIcons name="photo-library" size={32} color="#2c3e50" />
                    </TouchableOpacity>
                  </View>
                )}
                <Text style={styles.photoLabel}>{labels[index]}</Text>
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