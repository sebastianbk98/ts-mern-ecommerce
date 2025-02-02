import axios from "axios";

export const apiURL = import.meta.env.VITE_REACT_APP_API;

const apiClient = axios.create({
  baseURL: apiURL,
  headers: {
    "Content-type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    if (localStorage.getItem("user")) {
      config.headers.Authorization = `Bearer ${
        JSON.parse(localStorage.getItem("user")!).token
      }`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
