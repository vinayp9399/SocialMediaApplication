import axios from "axios";

const api = axios.create({
  baseURL: "https://socialmediaapplication-otsl.onrender.com",
  withCredentials: true, // sends cookie automatically
});

export default api;
