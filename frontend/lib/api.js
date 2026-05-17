import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // sends cookie automatically
});

export default api;
