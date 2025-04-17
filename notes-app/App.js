import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View, Button } from "react-native";

export default function App() {
  const [newNote, setNewNote] = useState("note");
  const [notes, setNotes] = useState([]);

  const handleNewNote = (event) => {
    setNewNote(event);
  };

  const handleButton = () => {
    const newNotes = notes.concat(newNote);
    setNotes(newNotes);
    setNewNote("");

    console.log("note to add: ", newNote);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textColor}>Aplicación de notas</Text>
      <Text style={styles.textColor}>Nueva nota: </Text>
      <TextInput
        editable
        multiline
        style={styles.input}
        value={newNote}
        onChangeText={handleNewNote}
        placeholder={newNote}
        numberOfLines={4}
      />
      <Button title="Agregar" onPress={handleButton} />

      {notes.map((n) => (
        <Text style={styles.textColor} key={n}>
          {n}
        </Text>
      ))}

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    paddingTop: 50,
  },
  textColor: {
    color: "#fff",
  },
  input: {
    color: "#000",
    height: 80,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: "#fff",
    resizeMode: "contain",
  },
});
