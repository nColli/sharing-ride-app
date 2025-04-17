# sharing-ride-app

## Introducción
Proyecto: aplicación multi-plataforma destinada a que personas compartan un viaje de manera rutinaria o esporádica, tanto en viajes dentro de la ciudad como de larga distancia.

Posible nombre: coRide

Tecnologías a utilizar: React Native - Expo

## Pasos crear template app y apk
npx create-expo-app@latest ||  npx create-expo-app@latest dumb-phone-app --template blank
npm start
npx expo install expo-dev-client 
npx expo:android
npx expo run:android
cd .\android\ 
.\gradlew clean    
.\gradlew assembleRelease  

Remove boilerplate:
npm run reset-project