import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';

const icon = require('./assets/icon.png')
const externalImageUrl = 'https://www.metacritic.com/a/img/catalog/provider/6/12/6-1-4757-52.jpg'

export default function App() {
  const [ textColor, setTextColor ] = useState('white');

  const handleButton = () => {
    const newColor = textColor==='white' ? 'black' : 'white'

    console.log('button pressed changing color from', textColor, 'to', newColor);

    setTextColor(newColor)
  }

  //console.log('rendering');

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Image blurRadius={5} source={icon} style={styles.icon} />

      <Image source={{ uri: externalImageUrl}} style={styles.externalImage} />

      <Text>Open up App.js to start working on your app!</Text>

      <View style={styles.box}>
        <Text>This is a text</Text>
      </View>
      
      <Button title="pulsa aca" onPress={handleButton} />

      <Text style={{color: textColor}}>Texto que desaparece con botón</Text>
  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    backgroundColor: 'red',
    height: 100,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center'
  },
  externalImage: {
    width: 195,
    height: 200,
    resizeMode: 'contain'
  },
  icon: {
    width: 200, 
    height: 100,
    resizeMode: 'contain'
  }
});
