import { useEffect, useState, useLayoutEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import getUrl from "../../../utils/url";
import { useAuth } from "../../AuthContext";
import { useNavigation } from "@react-navigation/native";

export default function TripChat() {
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const { auth } = useAuth();

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Chat`,
    });
  }, [navigation, id]);

  const fetchChat = async () => {
    console.log("ejecutando fetchChat");
    const token = auth;

    setLoading(true);
    setError("");
    try {
      const url = getUrl();
      console.log("url", url);
      const urlC = `${url}/api/trips/chat/${id}`;
      console.log("url completo", urlC);
      axios
        .get(urlC, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log("respuesta:", res.data);
          setMessages(res.data.messages || []);
        })
        .catch((error) => {
          console.log("error al solicitar chat", error.message);
        });
    } catch (_err) {
      setError("Error al cargar el chat");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("ejecutando useEffect");

    fetchChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setSending(true);
    setError("");
    try {
      await axios.post(
        `${getUrl()}/api/trips/chat/${id}`,
        { message: input },
        {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        },
      );
      setInput("");
      fetchChat();
    } catch (_err) {
      setError("No se pudo enviar el mensaje");
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 25}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Chat del Viaje</Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button title="Recargar" onPress={fetchChat} />
            <ScrollView
              style={styles.chatBox}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {loading ? (
                <Text>Cargando...</Text>
              ) : messages.length === 0 ? (
                <Text>No hay mensajes.</Text>
              ) : (
                messages.map((msg, idx) => (
                  <View key={idx} style={styles.message}>
                    <Text style={styles.sender}>
                      {msg.user.name + " " + msg.user.surname || "Usuario"}
                      {msg.isDriver ? " (conductor)" : ""}:
                    </Text>
                    <Text>{msg.message}</Text>
                  </View>
                ))
              )}
            </ScrollView>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Escribe un mensaje..."
              />
              <Button
                title="Enviar"
                onPress={sendMessage}
                disabled={sending || !input.trim()}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  error: {
    color: "#d00",
    marginBottom: 8,
    textAlign: "center",
  },
  chatBox: {
    flex: 1,
    marginVertical: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 8,
  },
  message: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: "#e3e3e3",
    borderRadius: 6,
  },
  sender: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 80,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginRight: 8,
    backgroundColor: "#fff",
  },
});
