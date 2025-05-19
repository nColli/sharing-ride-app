import React from "react";
import { View, ActivityIndicator, StyleSheet, Modal } from "react-native";

const LoadingOverlay = ({ visible }) => {
  return (
    <Modal transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 15,
    elevation: 5,
  },
});

export default LoadingOverlay;
