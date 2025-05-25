import getUrl from "./url";
import axios from "axios";

export default async function getReserve(reserveId, auth) {
  try {
    const url = getUrl() + "/api/reserves/" + reserveId;
    console.log("url", url);
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    });
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo reserva::", error);
    return null;
  }
}
