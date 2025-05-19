import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import getURL from '../utils/url';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { View, TextInput, Button, Text } from 'react-native';
import { styles } from '../styles';

interface Place {
    name: string;
    street: string;
    number: string;
    city: string;
}

type SelectPlaceProps = {
    handleContinuar: () => void;
    handleChangeCalle: (text: string) => void;
    handleChangeLocalidad: (text: string) => void;
    handleChangeNumero: (text: string) => void;
};

export default function SelectPlace({
    handleContinuar,
    handleChangeCalle,
    handleChangeLocalidad,
    handleChangeNumero
}: SelectPlaceProps) {
    const [regularPlaces, setRegularPlaces] = useState<Place[]>([]);
    const [selectedRegularPlace, setSelectedRegularPlace] = useState<Place | null>(null);

    useEffect(() => {
        const url = getURL() + '/api/places';

        axios.get(url) //agregar token
            .then((response) => {
                setRegularPlaces(response.data);
            })
            .catch((error) => {
                console.log('error al obtener lugares');
                //redireccionar a home con aviso de que lo intente de nuevo
            })

    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registra tu recorrido</Text>
            <Text style={styles.subtitle}>Elegi un punto de partida</Text>
            <Picker
                selectedValue={selectedRegularPlace}
                onValueChange={(itemValue, itemIndex) => 
                    setSelectedRegularPlace(itemValue)
                }
            >
                {regularPlaces.map((place) => (
                    <Picker.Item key={place.name} label={place.name} value={place} />
                ))} 
            </Picker>
            <Text>Calle:</Text>
            <TextInput
                style={styles.input}
                onChangeText={handleChangeCalle}
            />
            <Text>Numero:</Text>
            <TextInput
                style={styles.input}
                onChangeText={handleChangeNumero}
            />
            <Text>Localidad:</Text>
            <TextInput
                style={styles.input}
                onChangeText={handleChangeLocalidad}
            />

            
            {/* AGREGAR SELECCIONADOR DE PROVINCIAS, LISTA EXTRAERLA EN UTILITY Y VER DE HACER COMPONENTE PERSONALIZADO, ENVIANDOLE LOS HOOKS */}


            <Button title='continuar' onPress={handleContinuar} />
        </View>
    )
}