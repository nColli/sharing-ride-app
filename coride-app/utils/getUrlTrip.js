import axios from "axios";
import getUrl from "./url";

export default async function getUrlTrip(id, token) {
  const url = getUrl() + "/api/trips/route/" + id;

  console.log("url para obtener la ruta", url);

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener la ruta:", error);
    return null;
  }
}
