import axios from "axios";
import getUrl from "./url";

export default async function deleteReserve(reserveId, token) {
  try {
    await axios.delete(`${getUrl()}/api/reserves/${reserveId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("reserva eliminada");
  } catch (error) {
    console.log("error al eliminar reserva", error);
  }
}
