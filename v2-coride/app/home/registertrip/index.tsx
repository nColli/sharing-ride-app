import { View, Text, Button, Alert } from "react-native";
import { styles } from "../../../styles";
import {Picker} from '@react-native-picker/picker';
import { useEffect, useState } from "react";
import getURL from "../../../utils/url";
import axios from "axios";
import { useRouter } from "expo-router";

interface vehicle {
    name: string;
    model: string;
}

export default function SelectVehicle() {
    const [vehicles, setVehicles] = useState<vehicle[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<vehicle | null>(null);
    const router = useRouter();

    useEffect(() => {
        const url = getURL() + '/api/vehicles'; //obt vehiculos del usuario

        axios.get(url)
            .then((response) => {
                setVehicles(response.data);
            })
            .catch((error) => {
                console.log('error al obtener lugares');
                //redireccionar a home con aviso de que lo intente de nuevo
            })

        console.log('vehicles owned by user', vehicles);

    }, []);

    const handleRegisterVehicle = () => {
        router.navigate('home/registervehicle') //dsp hacer que cuando se registra vehiculo se retorne aca y no a home, marcar de donde proviene con context general
    }

    const handleContinue = () => {
        //agregar vehiculo a localstorage

        if (selectedVehicle != null) {
            router.navigate('home/registertrip/registerstart');
            return;
        }
        
        //no selecciono vehiculo
        Alert.alert('Seleccionar vehiculo', 'Por favor selecciona o crea un vehiculo');
        return;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>
                ¡Registra tu viaje!
            </Text>
            <Text style={styles.subtitle}>
                Selecciona el vehículo que vas a usar en el viaje
            </Text>
            <Picker
                selectedValue={selectedVehicle}
                onValueChange={(itemValue, itemIndex) => 
                    setSelectedVehicle(itemValue)
                }
            >
                {vehicles.map((vehicle) => (
                    <Picker.Item label={vehicle.name} value={vehicle} />
                ))} 
            </Picker>
            <Button title="Continuar" onPress={handleContinue} />
            <Text style={styles.subtitle}>
                ¿Querés registrar otro vehículo?
            </Text>
            <Button title="Registrar vehiculo"  onPress={handleRegisterVehicle}/>
        </View>
    )
}