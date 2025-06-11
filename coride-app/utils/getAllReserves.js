import getUrl from "./url";
import axios from "axios";

export default async function getAllReserves(token) {
  try {
    const url = getUrl() + "/api/reserves/all";
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
