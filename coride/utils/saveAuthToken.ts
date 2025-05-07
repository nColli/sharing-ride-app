import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosResponse } from "axios";

export default async function saveUserData(response: AxiosResponse<any>) {
  console.log('response', response);
  
  const authToken = response.data.tokenLogin;

  console.log('token', authToken);

  await AsyncStorage.setItem('authToken', authToken).then(() => {
    console.log('email saved');
  }).catch(error => {
    console.log('error saving email', error);
  })
  /* para debugging
  await AsyncStorage.getItem('authToken').then(t => {console.log('token from async', t)})
    .catch((error) => {
      console.log('error getting item', error);
      return
    })*/
}
 