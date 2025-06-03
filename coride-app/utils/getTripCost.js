import getUrl from "./url";
import axios from "axios";

export default async function getTripCost(token, tripId) {
  try {
    const url = getUrl() + "/api/trips/" + tripId;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.tripCost;
  } catch (error) {
    console.error("Error al obtener el costo del viaje:", error);
    return null;
  }
}
