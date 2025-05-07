import { Alert, Button, View } from "react-native";
import InputEmail from "./InputEmail";
import InputPassword from "./InputPassword";
import ErrorText from "./ErrorText";
import { styles } from "../styles";
import useLoading from "../custom_hooks/useLoading";
import { useState } from "react";
import { useRouter } from "expo-router";
import axios from "axios";
import saveAuthToken from "../utils/saveAuthToken";
import LoadingOverlay from "./LoadingOverlay";
import getURL from "../utils/url";

export default function FormLogin() {
    const { isLoading, withLoading } = useLoading();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [loginError, setLoginError] = useState('');
    const router = useRouter()

    const isInputValid = () => {
        console.log('validate login', email, password);
        console.log('errores email', emailError);
        
        if (emailError !== '') {
            Alert.alert('Error', emailError)
            return false;
        }
        if (!password) {
            Alert.alert('Error', 'Por favor ingresa tu contraseña');
            return false;
        }

        return true
    }

    const navigateToHome = () => {
        router.navigate('home')
    }

    const handleLogin = async () => {
        console.log('handle login');
        if (!isInputValid()) {
            return null;
        }
    
        console.log('input correcto, sending request');
    
        const body = {
            email,
            password
        }
    
        const url = `${getURL()}/api/login`;
    
        try {
            await withLoading(
                axios.post(url, body)
                    .then((response) => {
                        saveAuthToken(response);
                    })
            );
    
            navigateToHome();
    
        } catch (error) {
            Alert.alert('Usuario incorrecto', 'El correo o la contraseña no son correctas');
    
            setLoginError('El correo o la contraseña no son correctas')
    
            setTimeout(() => {
                setLoginError('');
            }, 3000)
        }
    }

    return (
        <View>
            <InputEmail
                email={email}
                setEmail={setEmail}
                emailError={emailError}
                setEmailError={setEmailError}
            />
            
            <InputPassword
                password={password}
                setPassword={setPassword}
            />

            <ErrorText error={loginError}/> 
            
            <View style={styles.button}>
                <Button title="Iniciar Sesión" onPress={handleLogin} />
            </View>

            <LoadingOverlay visible={isLoading} />
        </View>
    )
}