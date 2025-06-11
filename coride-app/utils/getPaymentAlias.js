import getUrl from "./url";
import axios from "axios";

export default async function getPaymentAlias(token) {
  try {
    const url = getUrl() + "/api/payments/";
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener los alias de pago:", error);
    return null;
  }
}
