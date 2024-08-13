import axios from "axios";

const apiClient = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:8080/api/"
      : "/api",
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
