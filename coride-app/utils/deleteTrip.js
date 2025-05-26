import axios from "axios";
import getUrl from "./url";

export default async function deleteTrip(tripId, token) {
  try {
    await axios.delete(`${getUrl()}/api/trips/${tripId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("viaje eliminado");
  } catch (error) {
    console.log("error al eliminar viaje", error);
  }
}
