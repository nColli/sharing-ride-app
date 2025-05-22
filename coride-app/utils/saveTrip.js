import axios from "axios";
import getURL from "./url";

export async function saveTrip(trip, token) {
  const url = getURL() + "/api/trips";
  const response = await axios.post(url, trip, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
