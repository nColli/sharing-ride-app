import getUrl from "./url";
import axios from "axios";

export default async function getNextTrip(token) {
  try {
    const url = getUrl() + "/api/trips/next-trip";
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener el siguiente viaje:", error);
    return null;
  }
}
