import getUrl from "./url";
import axios from "axios";

export default async function getNextReserve(token) {
  try {
    const url = getUrl() + "/api/reserves/next-reserve";
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener la siguiente reserva:", error);
    return null;
  }
}
