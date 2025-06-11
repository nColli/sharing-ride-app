import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { useAuth } from "../../AuthContext";
import getPaymentAlias from "../../../utils/getPaymentAlias";
import getUrl from "../../../utils/url";
import axios from "axios";

export default function ConfigPayment() {
  const { auth } = useAuth();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedAliasToEdit, setSelectedAliasToEdit] = useState("alias1");
  const [newAlias, setNewAlias] = useState("");
  const [newFee, setNewFee] = useState("");
  const [selectedPrincipalAlias, setSelectedPrincipalAlias] = useState("");

  useEffect(() => {
    loadPaymentAlias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPaymentAlias = async () => {
    try {
      setLoading(true);
      const data = await getPaymentAlias(auth);
      const paymentData = data[0];
      if (paymentData) {
        setPaymentData(paymentData);
        setNewAlias(paymentData.alias1 || "");
        setNewFee(paymentData.fee ? paymentData.fee.toString() : "");
        setSelectedPrincipalAlias(paymentData.alias || "");
      }
    } catch (error) {
      console.error("Error loading payment aliases:", error);
      Alert.alert("Error", "No se pudieron cargar los alias de pago");
    } finally {
      setLoading(false);
    }
  };

  const selectAliasToEdit = (aliasType) => {
    setSelectedAliasToEdit(aliasType);
    if (aliasType === "alias1") {
      setNewAlias(paymentData.alias1 || "");
    } else {
      setNewAlias(paymentData.alias2 || "");
    }
  };

  const handleFeeChange = (text) => {
    // Convert comma to point for Spanish keyboard users
    const formattedText = text.replace(",", ".");
    setNewFee(formattedText);
  };

  const hasChanges = () => {
    if (!paymentData) return false;

    const currentAlias =
      selectedAliasToEdit === "alias1"
        ? paymentData.alias1
        : paymentData.alias2;
    return (
      newAlias !== (currentAlias || "") ||
      newFee !== (paymentData.fee ? paymentData.fee.toString() : "") ||
      selectedPrincipalAlias !== (paymentData.alias || "")
    );
  };

  const saveChanges = async () => {
    if (!hasChanges()) {
      Alert.alert("Info", "No hay cambios para guardar");
      return;
    }

    try {
      setUpdating(true);
      const baseUrl = getUrl() + "/api/payments/";
      const updatePromises = [];

      const currentAlias =
        selectedAliasToEdit === "alias1"
          ? paymentData.alias1
          : paymentData.alias2;
      if (newAlias !== (currentAlias || "")) {
        updatePromises.push(
          axios.patch(
            baseUrl + selectedAliasToEdit,
            { value: newAlias.trim() },
            {
              headers: {
                Authorization: `Bearer ${auth}`,
              },
            },
          ),
        );
      }

      const currentFeeStr = paymentData.fee ? paymentData.fee.toString() : "";
      if (newFee !== currentFeeStr) {
        const feeValue = parseFloat(newFee);
        if (isNaN(feeValue) || feeValue < 0) {
          Alert.alert(
            "Error",
            "La tarifa debe ser un número válido mayor o igual a 0",
          );
          return;
        }
        updatePromises.push(
          axios.patch(
            baseUrl + "fee",
            { value: feeValue },
            {
              headers: {
                Authorization: `Bearer ${auth}`,
              },
            },
          ),
        );
      }

      if (selectedPrincipalAlias !== (paymentData.alias || "")) {
        updatePromises.push(
          axios.patch(
            baseUrl + "alias",
            { value: selectedPrincipalAlias },
            {
              headers: {
                Authorization: `Bearer ${auth}`,
              },
            },
          ),
        );
      }

      await Promise.all(updatePromises);

      await loadPaymentAlias();
      setEditMode(false);
      Alert.alert("Éxito", "Cambios guardados correctamente");
    } catch (error) {
      console.error("Error updating payment data:", error);
      Alert.alert("Error", "No se pudieron guardar los cambios");
    } finally {
      setUpdating(false);
    }
  };

  const cancelChanges = () => {
    if (paymentData) {
      const currentAlias =
        selectedAliasToEdit === "alias1"
          ? paymentData.alias1
          : paymentData.alias2;
      setNewAlias(currentAlias || "");
      setNewFee(paymentData.fee ? paymentData.fee.toString() : "");
      setSelectedPrincipalAlias(paymentData.alias || "");
    }
    setEditMode(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando datos de pago...</Text>
      </View>
    );
  }

  if (!paymentData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          No se pudieron cargar los datos de pago
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadPaymentAlias}>
          <Text style={styles.buttonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Configuración de Pagos</Text>

        <View style={styles.feeContainer}>
          <Text style={styles.subtitle}>Tarifa Actual:</Text>
          <View style={styles.feeDisplay}>
            <Text style={styles.feeText}>
              {paymentData.fee ? paymentData.fee.toFixed(2) : "0.00"}
            </Text>
          </View>
        </View>

        <View style={styles.aliasContainer}>
          <Text style={styles.subtitle}>Alias Disponibles:</Text>

          <View style={styles.aliasItem}>
            <Text
              style={[
                styles.aliasText,
                paymentData.alias === paymentData.alias1 &&
                  styles.principalAliasText,
              ]}
            >
              {paymentData.alias1}
            </Text>
            <View style={styles.labelContainer}>
              <Text style={styles.aliasLabel}>Alias 1</Text>
              {paymentData.alias === paymentData.alias1 && (
                <Text style={styles.principalLabel}>Principal</Text>
              )}
            </View>
          </View>

          <View style={styles.aliasItem}>
            <Text
              style={[
                styles.aliasText,
                paymentData.alias === paymentData.alias2 &&
                  styles.principalAliasText,
              ]}
            >
              {paymentData.alias2}
            </Text>
            <View style={styles.labelContainer}>
              <Text style={styles.aliasLabel}>Alias 2</Text>
              {paymentData.alias === paymentData.alias2 && (
                <Text style={styles.principalLabel}>Principal</Text>
              )}
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setEditMode(!editMode)}
          disabled={updating}
        >
          <Text style={styles.buttonText}>
            {editMode ? "Cancelar Edición" : "Editar Datos"}
          </Text>
        </TouchableOpacity>

        {editMode && (
          <View style={styles.editContainer}>
            <Text style={styles.subtitle}>Modificar Datos:</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nueva Tarifa:</Text>
              <TextInput
                style={styles.textInput}
                value={newFee}
                onChangeText={handleFeeChange}
                placeholder="Ingrese la nueva tarifa"
                keyboardType="numeric"
                editable={!updating}
              />
            </View>

            <Text style={styles.inputLabel}>Seleccionar Alias a Editar:</Text>
            <View style={styles.aliasSelectionContainer}>
              <TouchableOpacity
                style={[
                  styles.aliasSelectButton,
                  selectedAliasToEdit === "alias1" &&
                    styles.selectedAliasButton,
                ]}
                onPress={() => selectAliasToEdit("alias1")}
                disabled={updating}
              >
                <Text
                  style={[
                    styles.aliasSelectText,
                    selectedAliasToEdit === "alias1" &&
                      styles.selectedAliasButtonText,
                  ]}
                >
                  Alias 1
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.aliasSelectButton,
                  selectedAliasToEdit === "alias2" &&
                    styles.selectedAliasButton,
                ]}
                onPress={() => selectAliasToEdit("alias2")}
                disabled={updating}
              >
                <Text
                  style={[
                    styles.aliasSelectText,
                    selectedAliasToEdit === "alias2" &&
                      styles.selectedAliasButtonText,
                  ]}
                >
                  Alias 2
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Nuevo {selectedAliasToEdit === "alias1" ? "Alias 1" : "Alias 2"}
                :
              </Text>
              <TextInput
                style={styles.textInput}
                value={newAlias}
                onChangeText={setNewAlias}
                placeholder={`Ingrese el nuevo ${
                  selectedAliasToEdit === "alias1" ? "alias 1" : "alias 2"
                }`}
                editable={!updating}
              />
            </View>

            <Text style={styles.inputLabel}>Seleccionar Alias Principal:</Text>
            <View style={styles.aliasSelectionContainer}>
              <TouchableOpacity
                style={[
                  styles.aliasSelectButton,
                  selectedPrincipalAlias ===
                    (selectedAliasToEdit === "alias1"
                      ? newAlias
                      : paymentData.alias1) && styles.selectedAliasButton,
                ]}
                onPress={() =>
                  setSelectedPrincipalAlias(
                    selectedAliasToEdit === "alias1"
                      ? newAlias
                      : paymentData.alias1,
                  )
                }
                disabled={updating}
              >
                <Text
                  style={[
                    styles.aliasSelectText,
                    selectedPrincipalAlias ===
                      (selectedAliasToEdit === "alias1"
                        ? newAlias
                        : paymentData.alias1) && styles.selectedAliasButtonText,
                  ]}
                >
                  {selectedAliasToEdit === "alias1"
                    ? newAlias
                    : paymentData.alias1}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.aliasSelectButton,
                  selectedPrincipalAlias ===
                    (selectedAliasToEdit === "alias2"
                      ? newAlias
                      : paymentData.alias2) && styles.selectedAliasButton,
                ]}
                onPress={() =>
                  setSelectedPrincipalAlias(
                    selectedAliasToEdit === "alias2"
                      ? newAlias
                      : paymentData.alias2,
                  )
                }
                disabled={updating}
              >
                <Text
                  style={[
                    styles.aliasSelectText,
                    selectedPrincipalAlias ===
                      (selectedAliasToEdit === "alias2"
                        ? newAlias
                        : paymentData.alias2) && styles.selectedAliasButtonText,
                  ]}
                >
                  {selectedAliasToEdit === "alias2"
                    ? newAlias
                    : paymentData.alias2}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.cancelButton]}
                onPress={cancelChanges}
                disabled={updating}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  (!hasChanges() || updating) && styles.disabledButton,
                ]}
                onPress={saveChanges}
                disabled={!hasChanges() || updating}
              >
                <Text style={styles.buttonText}>
                  {updating ? "Guardando..." : "Guardar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#555",
  },
  feeContainer: {
    marginBottom: 30,
  },
  feeDisplay: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  feeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#28a745",
  },
  aliasContainer: {
    marginBottom: 30,
  },
  aliasItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  aliasText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  principalAliasText: {
    fontWeight: "bold",
    color: "#007AFF",
  },
  labelContainer: {
    alignItems: "flex-end",
    gap: 4,
  },
  aliasLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  principalLabel: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "bold",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  editButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  editContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    color: "#555",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 6,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  aliasSelectionContainer: {
    flexDirection: "row",
    marginBottom: 15,
    gap: 10,
  },
  aliasSelectButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  selectedAliasButton: {
    borderColor: "#007AFF",
    backgroundColor: "#E3F2FD",
  },
  aliasSelectText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  selectedAliasButtonText: {
    color: "#007AFF",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 50,
  },
  errorText: {
    textAlign: "center",
    fontSize: 16,
    color: "#d9534f",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#6c757d",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
});
