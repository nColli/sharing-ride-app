import { View, Text, StyleSheet, Button } from "react-native"

export default function Dashboard() {
  const handleRegisterVehicle = () => {
    console.log('Registrar vehículo');
  }

  return (
    <View style={styles.container}>
      <Button title="Registrar vehículo"  />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#2c3e50',
  },
})