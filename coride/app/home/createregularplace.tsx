import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { debounce } from 'lodash';

// Define interfaces for our component
interface AddHabitualPlaceProps {
  apiUrl?: string;
}

interface FormData {
  name: string;
  address: string;
  number: string;
  city: string;
  province: string;
}

interface AddressValidation {
  isValidating: boolean;
  isValid: boolean | null;
  message: string;
}

interface Coordinates {
  lat: string;
  lon: string;
}

const AddHabitualPlace: React.FC<AddHabitualPlaceProps> = ({ 
  apiUrl = 'https://backend-sharing-ride-app.onrender.com/api/places' 
}) => {
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    address: '',
    number: '',
    city: '',
    province: ''
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [addressValidation, setAddressValidation] = useState<AddressValidation>({
    isValidating: false,
    isValid: null,
    message: ''
  });
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);

  // Setup validation debouncer with useEffect to properly clean up
  const validateAddressWithDebounce = debounce(async () => {
    const { address, number, city, province } = formData;
    
    // Only validate if we have enough address details
    if (!address.trim() || !city.trim() || !province.trim()) {
      return;
    }
    
    setAddressValidation({
      isValidating: true,
      isValid: null,
      message: 'Validando dirección...'
    });
    
    try {
      // Format the address query
      const query = `${address} ${number}, ${city}, ${province}, Argentina`;
      
      // Call Nominatim API to validate the address
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: query,
          format: 'json',
          country: 'Argentina',
          addressdetails: 1,
          limit: 1
        },
        headers: {
          'User-Agent': 'PlacesApp/1.0' // OpenStreetMap requires a user agent
        }
      });
      
      if (response.data && response.data.length > 0) {
        // Address found - it's valid
        const result = response.data[0];
        setCoordinates({
          lat: result.lat,
          lon: result.lon
        });
        
        setAddressValidation({
          isValidating: false,
          isValid: true,
          message: 'Dirección válida'
        });
      } else {
        // Address not found - might not be valid
        setCoordinates(null);
        setAddressValidation({
          isValidating: false,
          isValid: false,
          message: 'No pudimos validar esta dirección'
        });
      }
    } catch (error) {
      console.error('Error validating address:', error);
      setAddressValidation({
        isValidating: false,
        isValid: null,
        message: 'Error al validar la dirección'
      });
    }
  }, 1000);

  // Run validation when form data changes
  useEffect(() => {
    const { address, city, province } = formData;
    if (address && city && province) {
      validateAddressWithDebounce();
    }
    
    // Clean up on unmount
    return () => {
      validateAddressWithDebounce.cancel();
    };
  }, [formData.address, formData.number, formData.city, formData.province]);
  
  const handleChange = (field: keyof FormData, value: string): void => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
    
    // Reset validation when address fields change
    if (['address', 'number', 'city', 'province'].includes(field)) {
      setAddressValidation({
        isValidating: false,
        isValid: null,
        message: ''
      });
    }
  };
  
  const validateForm = (): string | null => {
    const { name, address, number, city, province } = formData;
    
    if (!name.trim()) return 'El nombre es obligatorio';
    if (!address.trim()) return 'La dirección es obligatoria';
    if (!number.trim()) return 'El número es obligatorio';
    if (!city.trim()) return 'La ciudad es obligatoria';
    if (!province.trim()) return 'La provincia es obligatoria';
    
    // Check if address validation was attempted and failed
    if (addressValidation.isValid === false) {
      return 'La dirección no parece ser válida. ¿Desea continuar de todas formas?';
    }
    
    return null;
  };

  const handleSubmit = async (): Promise<void> => {
    const errorMessage = validateForm();
    
    if (errorMessage) {
      if (addressValidation.isValid === false) {
        // If the error is about an invalid address, give the user an option to proceed anyway
        Alert.alert(
          'Dirección no validada', 
          errorMessage,
          [
            { 
              text: 'Corregir', 
              style: 'cancel' 
            },
            {
              text: 'Continuar de todas formas',
              onPress: () => submitForm()
            }
          ]
        );
      } else {
        Alert.alert('Error', errorMessage);
      }
      return;
    }

    submitForm();
  };
  
  const submitForm = async (): Promise<void> => {
    setLoading(true);
    
    // Prepare data to send, including coordinates if available
    const dataToSend = {
      ...formData,
      ...(coordinates && { coordinates })
    };
    
    try {
      const response = await axios.post(apiUrl, dataToSend);
      
      // Handle successful response
      Alert.alert(
        'Éxito',
        'Lugar agregado correctamente',
        [{ text: 'OK', onPress: () => {
          // Navigate to home screen after successful addition
          router.push('/');
        }}]
      );
      
      console.log('Place added successfully:', response.data);
    } catch (error) {
      // Handle error
      Alert.alert(
        'Error',
        'No se pudo agregar el lugar. Inténtelo nuevamente.',
        [{ text: 'OK' }]
      );
      
      console.error('Error adding place:', error);
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
              onChangeText={(text) => handleChange('name', text)}
              placeholder="Nombre del lugar"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Calle:</Text>
            <TextInput
              style={[
                styles.input,
                addressValidation.isValid === false && styles.invalidInput,
                addressValidation.isValid === true && styles.validInput
              ]}
              value={formData.address}
              onChangeText={(text) => handleChange('address', text)}
              placeholder="Nombre de la calle"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Número:</Text>
            <TextInput
              style={[
                styles.input,
                addressValidation.isValid === false && styles.invalidInput,
                addressValidation.isValid === true && styles.validInput
              ]}
              value={formData.number}
              onChangeText={(text) => handleChange('number', text)}
              keyboardType="numeric"
              placeholder="Número"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Localidad:</Text>
            <TextInput
              style={[
                styles.input,
                addressValidation.isValid === false && styles.invalidInput,
                addressValidation.isValid === true && styles.validInput
              ]}
              value={formData.city}
              onChangeText={(text) => handleChange('city', text)}
              placeholder="Ciudad o localidad"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Provincia:</Text>
            <TextInput
              style={[
                styles.input,
                addressValidation.isValid === false && styles.invalidInput,
                addressValidation.isValid === true && styles.validInput
              ]}
              value={formData.province}
              onChangeText={(text) => handleChange('province', text)}
              placeholder="Provincia"
            />
          </View>
          
          {addressValidation.message ? (
            <View style={[
              styles.validationMessage,
              addressValidation.isValid === true && styles.validMessage,
              addressValidation.isValid === false && styles.invalidMessage
            ]}>
              {addressValidation.isValidating ? (
                <ActivityIndicator size="small" color="#007AFF" />
              ) : (
                <Text style={[
                  styles.validationText,
                  addressValidation.isValid === true && styles.validText,
                  addressValidation.isValid === false && styles.invalidText
                ]}>
                  {addressValidation.message}
                </Text>
              )}
            </View>
          ) : null}
          
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  validInput: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
  },
  invalidInput: {
    borderColor: '#F44336',
    backgroundColor: 'rgba(244, 67, 54, 0.05)',
  },
  validationMessage: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  validMessage: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  invalidMessage: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  validationText: {
    fontSize: 14,
    textAlign: 'center',
  },
  validText: {
    color: '#4CAF50',
  },
  invalidText: {
    color: '#F44336',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default AddHabitualPlace;