import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});
export const axiosI = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

const refreshToken = async (): Promise<string> => {
  try {
    console.log("gaeshvaaaaa");
    const response = await axios.post(
      "http://localhost:5000/refresh_token",
      {},
      { withCredentials: true }
    );

    const token = response.data.accessToken as string;

    return token;
  } catch (error) {
    console.error("Failed to refresh token", error);
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
    console.log("response gaeshvaaaa");

    // Check if response error is correctly logging
    console.error("Response error:", error.response ? error.response : error);

    const originalRequest = error.config;
    if (error.response && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        console.log("Attempting to refresh the token...");
        const token: string = await refreshToken();
        localStorage.setItem("token", token);
        console.log("newtokeeeeeennn", token);

        originalRequest.headers["authorization"] = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
