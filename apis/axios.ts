import axios from "axios";
// const BASE_URL = "http://16.24.77.35:3004";
const BASE_URL = "http://localhost:3004";
// const BASE_URL = "http://192.168.0.58:3004";

export default axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  // withCredentials: true,
});
