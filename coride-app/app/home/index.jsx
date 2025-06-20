import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../AuthContext";
import { useState, useEffect } from "react";
import getHasPendingReviews from "../../utils/getHasPendingReviews";

const functionalButtons = [
  {
    id: "1",
    title: "Registrar vehiculo",
    icon: "🚗",
    route: "home/register-vehicle",
  },
  {
    id: "2",
    title: "Agregar lugar habitual",
    icon: "🏠",
    route: "home/create-regular-place",
  },
  {
    id: "3",
    title: "Registrar viaje",
    icon: "🚀",
    route: "home/register-trip",
  },
  {
    id: "4",
    title: "Viajes pendientes",
    icon: "🚗",
    route: "home/pending-trips",
  },
  {
    id: "5",
    title: "Reservar viaje",
    icon: "🚘",
    route: "home/reserve-trip",
  },
  {
    id: "6",
    title: "Reservas pendientes",
    icon: "⏰",
    route: "home/pending-reserves",
  },
  {
    id: "7",
    title: "Próximo viaje",
    icon: "🙋‍♂️",
    route: "home/next-trip",
  },
  {
    id: "8",
    title: "Iniciar viaje",
    icon: "🚀",
    route: "home/start-trip",
  },
  {
    id: "9",
    title: "Ver estadísticas",
    icon: "📊",
    route: "home/watch-statistics",
  },
];

const HomeScreen = () => {
  const router = useRouter();
  const { auth } = useAuth();
  const [hasPendingReviews, setHasPendingReviews] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = auth;
      const pendingReviews = await getHasPendingReviews(token);
      console.log("pendingReviews", pendingReviews);
      setHasPendingReviews(pendingReviews);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProfilePress = () => {
    router.push("/home/user-management");
  };

  const handleFunctionPress = (route) => {
    console.log("route", route);
    router.push(route);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Inicio</Text>
        </View>
        <TouchableOpacity
          onPress={handleProfilePress}
          style={styles.profileContainer}
        >
          <Image
            source={{
              uri: "https://t3.ftcdn.net/jpg/06/19/26/46/360_F_619264680_x2PBdGLF54sFe7kTBtAvZnPyXgvaRw0Y.jpg",
            }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>¡Bienvenido!</Text>
        <Text style={styles.subText}>¿Qué te gustaría hacer hoy?</Text>
      </View>

      <ScrollView contentContainerStyle={styles.functionContainer}>
        {hasPendingReviews && (
          <TouchableOpacity
            style={styles.functionButton}
            onPress={() => handleFunctionPress("home/review-driver")}
          >
            <Text style={styles.functionIcon}>★★★</Text>
            <Text style={styles.functionTitle}> Evaluar Conductor </Text>
          </TouchableOpacity>
        )}

        {functionalButtons.map((button) => (
          <TouchableOpacity
            key={button.id}
            style={styles.functionButton}
            onPress={() => handleFunctionPress(button.route)}
          >
            <Text style={styles.functionIcon}>{button.icon}</Text>
            <Text style={styles.functionTitle}>{button.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    marginTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileContainer: {
    marginLeft: 15,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#3498db",
  },
  welcomeContainer: {
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subText: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  functionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  functionButton: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  functionIcon: {
    fontSize: 28,
    marginBottom: 10,
  },
  functionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
});

export default HomeScreen;
