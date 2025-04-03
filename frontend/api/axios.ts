import axios from "axios";
import { handleLogout } from "../src/hook/logout";

const DEV = false;

const axiosInstance = axios.create({
  baseURL: DEV ? "http://localhost:5000" : "https://web3auth-bls6.onrender.com",
  withCredentials: true,
});
export const axiosI = axios.create({
  baseURL: DEV ? "http://localhost:5000" : "https://web3auth-bls6.onrender.com",
  withCredentials: true,
});

const refreshToken = async (): Promise<string> => {
  try {
    const response = await axiosI.post(
      `${
        DEV ? "http://localhost:5000" : "https://web3auth-bls6.onrender.com"
      }/refresh_token`
    );

    const token = response.data.accessToken as string;

    return token;
  } catch (error) {
    handleLogout();
    // console.error("Failed to refresh token", error);
    throw error;
  }
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  async (response) => response,
  async (error) => {
    // console.error("Response error:", error.response ? error.response : error);

    const originalRequest = error.config;
    if (error.response && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const token: string = await refreshToken();
        localStorage.setItem("token", token);

        originalRequest.headers["authorization"] = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // console.error("Failed to refresh token:", refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
