import { View, Text, Button } from "react-native";
import { styles } from "../../../styles";
import {Picker} from '@react-native-picker/picker';
import { useEffect, useState } from "react";
import getURL from "../../../utils/url";
import axios from "axios";
import { useRouter } from "expo-router";

interface vehicle {
    name: string
}

export default function SelectVehicle() {
    const [vehicles, setVehicles] = useState<vehicle[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState();
    const router = useRouter();

    useEffect(() => {
        const url = getURL() + '/api/vehicles'; //obt vehiculos del usuario

        axios.get(url)
            .then((response) => {
                setVehicles(response.data);
            })

        console.log('vehicles owned by user', vehicles);

    }, []);

    const handleRegisterVehicle = () => {
        router.navigate('home/registervehicle')
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
            <Text style={styles.subtitle}>
                ¿Querés registrar otro vehículo?
            </Text>
            <Button title="Registrar vehiculo"  onPress={handleRegisterVehicle}/>
        </View>
    )
}