import axios from "axios";
import getUrl from "./url";

export async function createReserve(newReserve, token) {
  //es rutina, se crea en server, se envia normalmente
  try {
    const response = await axios.post(`${getUrl()}/api/reserves`, newReserve, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.log(
      "error al crear reserva en servidor o no se ha encontrado reservas",
      error,
    );
    return null;
  }
}
