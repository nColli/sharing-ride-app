import { useEffect, useState } from "react";
import getURL from "../../../utils/url";
import axios from "axios";
import { View, Text, TextInput, Button } from "react-native";
import { styles } from "../../../styles";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";

interface Place {
    name: string;
    street: string;
    number: string;
    city: string
}

export default function SelectStartPlace() {
    const defaultPlace: Place = {
        name: '',
        street: '',
        number: '',
        city: ''
    }

    const [place, setPlace] = useState<Place>(defaultPlace);
    const [regularPlaces, setRegularPlaces] = useState<Place[]>([]);
    const [selectedRegularPlace, setSelectedRegularPlace] = useState<Place | null>(null);

    const router = useRouter();

    useEffect(() => {
        const url = getURL() + '/api/places';

        axios.get(url)
            .then((response) => {
                setRegularPlaces(response.data);
            })
            .catch((error) => {
                console.log('error al obtener lugares');
                //redireccionar a home con aviso de que lo intente de nuevo
            })

    }, []);


    const handleChangeCalle = (calle: string) => {
        const newPlace: Place = {
                ...place,
                street: calle
            }

        setPlace(newPlace);
    }

    const handleChangeNumero = (numero: string) => {
        const newPlace: Place = {
                ...place,
                number: numero
            }

        setPlace(newPlace);
    }

    const handleChangeLocalidad = (localidad: string) => {
        const newPlace: Place = {
                ...place,
                city: localidad
            }

        setPlace(newPlace);
    }

    const handleContinuar = () => {
        //guardar datos en localstorage

        
        router.navigate('/home/registertrip/registerend')
    }
    
    

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
                    <Picker.Item label={place.name} value={place} />
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