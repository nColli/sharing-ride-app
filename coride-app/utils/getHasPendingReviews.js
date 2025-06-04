import getUrl from "./url";
import axios from "axios";

export default async function getHasPendingReviews(token) {
  try {
    const url = getUrl() + "/api/reserves/pending-review";
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.pendiente;
  } catch (error) {
    console.log("Error al obtener las revisiones pendientes:", error);
    return false;
  }
}
