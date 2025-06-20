import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
    paddingTop: 0,
    marginTop: 10,
    paddingBottom: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#2c3e50",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    color: "#7f8c8d",
  },
  formContainer: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#2c3e50",
  },
  input: {
    height: 50,
    borderColor: "#bdc3c7",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    padding: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2c3e50",
  },
  pickerContainer: {
    borderColor: "#bdc3c7",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  errorInput: {
    borderColor: "#e74c3c",
  },
  errorText: {
    color: "#e74c3c",
    marginBottom: 10,
    textAlign: "center",
    fontSize: 17,
  },
  photosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  photoActions: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#bdc3c7",
    borderRadius: 10,
    backgroundColor: "#f5f6fa",
  },
  actionButton: {
    padding: 10,
    marginVertical: 5,
  },
  photoLabel: {
    textAlign: "center",
    marginTop: 8,
    color: "#7f8c8d",
  },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#e74c3c",
    borderRadius: 15,
    padding: 5,
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
    color: "#2c3e50",
  },
  descriptionText: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "#7f8c8d",
    marginBottom: 40,
  },
  typing: {
    flexDirection: "row",
    color: "#2c3e50",
  },
  cursor: {
    fontWeight: "bold",
  },
  hand: {
    fontSize: 40,
    marginTop: 10,
  },
  inlineHand: {
    fontSize: 28,
    marginLeft: 4,
  },
  // Trip container styles
  scrollView: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  tripContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tripHeader: {
    marginBottom: 12,
  },
  datePassengers: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  passengersText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  timeText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
    marginTop: 4,
  },
  locations: {
    marginTop: 8,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 6,
    lineHeight: 22,
  },
  chatButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
  dropdownContainer: {
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: "#bdc3c7",
    borderRadius: 8,
    margin: 10,
  },
});

export { styles };
