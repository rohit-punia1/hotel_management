import getAPIMap from "./apiUrl";
import api from "./axios";

export const searchHotels = async (payload) => {
  let url =
    getAPIMap("searchHotels") + `?destinationId=${payload.destinationId}`;
  const res = await api.post(url, payload);
  return res;
};
