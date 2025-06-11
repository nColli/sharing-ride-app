import getUrl from "./url";
import axios from "axios";

export default async function getReserves(token) {
  try {
    const url = getUrl() + "/api/reserves";
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener las reservas:", error);
    return null;
  }
}
