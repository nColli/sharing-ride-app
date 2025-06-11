import getUrl from "./url";
import axios from "axios";

export default async function getAllTrips(token) {
  try {
    const url = getUrl() + "/api/trips";
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener los viajes:", error);
    return null;
  }
}
