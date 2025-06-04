import getUrl from "./url";
import axios from "axios";

export default async function getPendingReview(token) {
  try {
    const url = getUrl() + "/api/reserves/review-driver";
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error al obtener la revisión pendiente:", error);
    const returnData = {
      reserve: null,
      driver: null,
    };
    return returnData;
  }
}
