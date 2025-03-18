import axios from "axios";
import { logout } from "./redux/slices/authSlice";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Request Interceptor (Attaching Token)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (Handling 401 Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      import("./redux/store").then(({ store }) => {
        store.dispatch(logout());
      });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
