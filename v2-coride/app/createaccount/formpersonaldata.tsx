import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, Platform, ScrollView, Appearance } from "react-native";
import {Picker} from '@react-native-picker/picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { styles } from "../../styles"

export default function Insertpersonaldata() {
  const [dni, setDni] = useState('')
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [locality, setLocality] = useState("");
  const [province, setProvince] = useState("");
  const [errors, setErrors] = useState({
    street: "",
    number: "",
    locality: "",
    province: ""
  });
  const router = useRouter()

  const handleDni = (text: string) => {
    setDni(text)
  }

  const handleNombre = (text: string) => {
    setNombre(text)
  }

  const handleApellido = (text: string) => {
    setApellido(text)
  }

  const onChangeFecha = (event: any) => {
    setShowDatePicker(false);
    if (event) {
      setFechaNacimiento(event);
    }
  };

  // Formatear fecha para mostrar (ej: "15/05/1990")
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-AR');
  };

  const PROVINCES = [
    "Buenos Aires",
    "CABA",
    "Catamarca",
    "Chaco",
    "Chubut",
    "Córdoba",
    "Corrientes",
    "Entre Ríos",
    "Formosa",
    "Jujuy",
    "La Pampa",
    "La Rioja",
    "Mendoza",
    "Misiones",
    "Neuquén",
    "Río Negro",
    "Salta",
    "San Juan",
    "San Luis",
    "Santa Cruz",
    "Santa Fe",
    "Santiago del Estero",
    "Tierra del Fuego",
    "Tucumán"
  ];

  const validateStreet = (text: string) => {
    const regex = /^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]{3,}$/;
    return regex.test(text);
  };

  const validateNumber = (text: string) => {
    const regex = /^\d{1,6}$/;
    return regex.test(text) && parseInt(text) > 0;
  };

  const validateLocality = (text: string) => {
    const regex = /^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]{3,}$/;
    return regex.test(text);
  };

  const validateForm = () => {
    const newErrors = {
      street: "",
      number: "",
      locality: "",
      province: ""
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
    return Object.values(newErrors).every(error => error === "");
  };

  const saveAddress = async () => {
    try {
      await AsyncStorage.multiSet([
        ['calle', street],
        ['numero', number],
        ['localidad', locality],
        ['provincia', province]
      ])
    } catch (error) {
      console.error("Error guardando dirección:", error);
    }
  };

  const handleSignup = async () => {
    if (!dni || !nombre || !apellido || !fechaNacimiento) {
      Alert.alert('Error', 'Complete todos los campos')
      return
    }

    //despues de registrarse eliminar data critica
    await AsyncStorage.multiSet([
      ['dni', dni],
      ['nombre', nombre],
      ['apellido', apellido],
      ['fechaNacimiento', fechaNacimiento.toISOString()]
    ]).then((response) => {console.log('response store', response)})
      .catch((error) => {console.log('error', error)})

    saveAddress()

    router.navigate('createaccount/enterphotos')
  }

  return (
      <ScrollView contentContainerStyle={styles.container}>
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
            isDarkModeEnabled={Appearance.getColorScheme() === 'light'}
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
        {errors.locality && <Text style={styles.errorText}>{errors.locality}</Text>}

        <Text style={styles.label}>Provincia</Text>
        <View style={[styles.pickerContainer, errors.province && styles.errorInput]}>
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
        {errors.province && <Text style={styles.errorText}>{errors.province}</Text>}

        <Button title="Continuar" onPress={handleSignup} />

      </ScrollView>
    );
}