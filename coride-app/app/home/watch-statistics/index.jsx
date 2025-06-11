import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuth } from "../../AuthContext";
import getAllTrips from "../../../utils/getAllTrips";
import getAllReserves from "../../../utils/getAllReserves";
import { format, startOfDay, endOfDay, isWithinInterval } from "date-fns";
import { es } from "date-fns/locale";

export default function WatchStatistics() {
  const { auth } = useAuth();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [trips, setTrips] = useState([]);
  const [reserves, setReserves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const monthBefore = new Date(yesterday);
    monthBefore.setMonth(yesterday.getMonth() - 1);

    setStartDate(monthBefore);
    setEndDate(yesterday);
  }, []);
  useEffect(() => {
    if (auth) {
      loadStatistics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, auth]);

  const loadStatistics = async () => {
    setLoading(true);
    try {
      const tripsData = await getAllTrips(auth);
      if (tripsData) {
        setTrips(tripsData);
      }

      const reservesData = await getAllReserves(auth);
      if (reservesData) {
        setReserves(reservesData);
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar las estadísticas");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStatistics();
    setRefreshing(false);
  };

  const onStartDateChange = (event, selectedDate) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    setShowEndPicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };
  const filterByDateRange = (data, dateField = "dateStart") => {
    return data.filter((item) => {
      const itemDate = new Date(item[dateField]);
      return isWithinInterval(itemDate, {
        start: startOfDay(startDate),
        end: endOfDay(endDate),
      });
    });
  };

  const filteredTrips = filterByDateRange(trips, "dateStart");
  const filteredReserves = filterByDateRange(reserves, "dateStart");
  const tripStats = {
    total: filteredTrips.length,
    completed: filteredTrips.filter(
      (trip) =>
        trip.status === "pago pendiente" || trip.status === "finalizado",
    ).length,
    pending: filteredTrips.filter(
      (trip) => trip.status === "en proceso" || trip.status === "pendiente",
    ).length,
    totalPassengers: filteredTrips.reduce(
      (sum, trip) => sum + (trip.bookings?.length || 0),
      0,
    ),
    totalEarnings: filteredTrips.reduce(
      (sum, trip) => sum + (parseFloat(trip.tripCost) || 0),
      0,
    ),
  };
  const reserveStats = {
    total: filteredReserves.length,
    completed: filteredReserves.filter(
      (reserve) =>
        reserve.status === "completada" || reserve.status === "evaluada",
    ).length,
    totalSpent: filteredReserves
      .filter(
        (reserve) =>
          reserve.status === "completada" || reserve.status === "evaluada",
      )
      .reduce((sum, reserve) => {
        return sum + (parseFloat(reserve.trip?.tripCost) || 0);
      }, 0),
  };
  const isDriverOnly = trips.length > 0 && reserves.length === 0;
  const isPassengerOnly = trips.length === 0 && reserves.length > 0;

  const StatCard = ({ title, value, subtitle, color = "#007AFF" }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const DatePickerButton = ({ date, onPress, label }) => (
    <TouchableOpacity style={styles.dateButton} onPress={onPress}>
      <Text style={styles.dateButtonLabel}>{label}</Text>
      <Text style={styles.dateButtonText}>
        {format(date, "dd/MM/yyyy", { locale: es })}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Estadísticas de Viajes</Text>
        <Text style={styles.subtitle}>
          Revisa tus estadísticas en el período seleccionado
        </Text>
      </View>
      <View style={styles.dateContainer}>
        <Text style={styles.sectionTitle}>Período de análisis</Text>
        <View style={styles.dateRow}>
          <DatePickerButton
            date={startDate}
            onPress={() => setShowStartPicker(true)}
            label="Fecha inicio"
          />
          <DatePickerButton
            date={endDate}
            onPress={() => setShowEndPicker(true)}
            label="Fecha fin"
          />
        </View>
      </View>
      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={onStartDateChange}
          maximumDate={endDate}
        />
      )}
      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={onEndDateChange}
          minimumDate={startDate}
          maximumDate={new Date()}
        />
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Cargando estadísticas...</Text>
        </View>
      ) : (
        <>
          {!isPassengerOnly && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                📊 Estadísticas como Conductor
              </Text>
              <View style={styles.statsGrid}>
                <StatCard
                  title="Viajes Totales"
                  value={tripStats.total}
                  color="#007AFF"
                />
                <StatCard
                  title="Viajes Completados"
                  value={tripStats.completed}
                  color="#28a745"
                />
                <StatCard
                  title="Viajes Pendientes"
                  value={tripStats.pending}
                  color="#ffc107"
                />
                <StatCard
                  title="Total Pasajeros"
                  value={tripStats.totalPassengers}
                  color="#17a2b8"
                />
                <StatCard
                  title="Ganancias Totales"
                  value={`$${tripStats.totalEarnings.toLocaleString()}`}
                  color="#28a745"
                />
                <StatCard
                  title="Promedio por Viaje"
                  value={
                    tripStats.completed > 0
                      ? `$${(tripStats.totalEarnings / tripStats.completed).toLocaleString()}`
                      : "$0"
                  }
                  color="#6c757d"
                />
              </View>
            </View>
          )}

          {!isDriverOnly && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                🎫 Estadísticas como Pasajero
              </Text>
              <View style={styles.statsGrid}>
                <StatCard
                  title="Reservas Totales"
                  value={reserveStats.total}
                  color="#6f42c1"
                />
                <StatCard
                  title="Reservas Completadas"
                  value={reserveStats.completed}
                  color="#28a745"
                />
                <StatCard
                  title="Total Gastado"
                  value={`$${reserveStats.totalSpent.toLocaleString()}`}
                  color="#fd7e14"
                />
                <StatCard
                  title="Promedio por Reserva"
                  value={
                    reserveStats.completed > 0
                      ? `$${(reserveStats.totalSpent / reserveStats.completed).toFixed(0)}`
                      : "$0"
                  }
                  color="#6c757d"
                />
              </View>
            </View>
          )}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📈 Resumen del Período</Text>
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryText}>
                Del {format(startDate, "dd 'de' MMMM", { locale: es })} al{" "}
                {format(endDate, "dd 'de' MMMM 'de' yyyy", { locale: es })}
              </Text>
              <Text style={styles.summarySubtext}>
                Total de actividad: {tripStats.total + reserveStats.total}{" "}
                viajes
              </Text>
              <Text style={styles.summarySubtext}>
                Balance: $
                {(
                  tripStats.totalEarnings - reserveStats.totalSpent
                ).toLocaleString()}
              </Text>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#6c757d",
  },
  dateContainer: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 15,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  dateButton: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  dateButtonLabel: {
    fontSize: 12,
    color: "#6c757d",
    marginBottom: 5,
  },
  dateButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2c3e50",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 50,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#6c757d",
  },
  section: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  statCard: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    width: "48%",
    marginBottom: 10,
  },
  statTitle: {
    fontSize: 12,
    color: "#6c757d",
    marginBottom: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 11,
    color: "#6c757d",
  },
  summaryContainer: {
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  summaryText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 10,
  },
  summarySubtext: {
    fontSize: 14,
    color: "#6c757d",
    textAlign: "center",
    marginBottom: 5,
  },
});
