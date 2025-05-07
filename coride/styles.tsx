import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    paddingTop: 0
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#7f8c8d',
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#2c3e50',
  },
  input: {
    height: 50,
    borderColor: '#bdc3c7',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    padding: 10
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
    textAlign: 'center',
    fontSize: 17,
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  photoActions: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#bdc3c7',
    borderRadius: 10,
    backgroundColor: '#f5f6fa',
  },
  actionButton: {
    padding: 10,
    marginVertical: 5,
  },
  photoLabel: {
    textAlign: 'center',
    marginTop: 8,
    color: '#7f8c8d',
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#e74c3c',
    borderRadius: 15,
    padding: 5,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%'
  },
})

export { styles }