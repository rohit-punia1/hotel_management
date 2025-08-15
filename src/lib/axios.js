import axios from "axios";

const api = axios.create({
  baseURL: "https://staging.travelyatra.com",
  headers: {
    "x-tenant-id": "pml",
    "Content-Type": "application/json",
  },
});

export default api;