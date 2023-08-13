import axios from "axios";

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

const myAxios = axios.create({
  baseURL: BASE_API_URL + "/api",
  timeout: 2000,
  withCredentials: true,
  validateStatus: function (status) {
    return status >= 200 && status < 500; // default
  },
});
/*
// Add a request interceptor
myAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Add a response interceptor
myAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post("/api/refresh-token", { refreshToken });
        const { token } = response.data;

        localStorage.setItem("authToken", token);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axios(originalRequest);
      } catch (error) {
        // Handle refresh token error or redirect to login
      }
    }
    return Promise.reject(error);
  },
);
*/
export default myAxios;
