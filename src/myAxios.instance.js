import axios from "axios";

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

const myAxios = axios.create({
  baseURL: BASE_API_URL + "/api",
  timeout: 2000,
  //  withCredentials: true,
  //  validateStatus: function (status) {
  //   return status >= 200 && status < 500; // default
  //  },
});

// Add a request interceptor
myAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log("No access token added to request");
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Add a response interceptor
myAxios.interceptors.response.use(
  (response) => {
    console.log("Intercepting response status:", response.status);
    return response;
  },
  async (error) => {
    console.log("error:", error);
    console.log("error.code:", error.code);
    if (error.code !== "ERR_NETWORK" && error.code !== "ECONNABORTED") {
      console.log("Intercepting response status:", error.response.status);
      const originalRequest = error.config;
      console.log("Intercepting response:", originalRequest);
      // If the error status is 401 and there is no originalRequest._retry flag,
      // it means the token has expired and we need to refresh it
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (refreshToken) {
            const response = await myAxios.post("/auth/refresh-token", { refreshToken });
            // Check if refresh token valid, otherwise login again
            if (response.status !== 200) {
              throw new Error(response.statusText);
            }

            const tokens = response.data;
            localStorage.setItem("accessToken", tokens.accessToken);
            console.log("Access token refreshed");

            // Retry the original request with the new token
            originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
            return axios(originalRequest);
          }
        } catch (error) {
          console.error("Token refresh error:", error);
          // Handle refresh token error or redirect to login
          // localStorage.clear();
          // return redirect("/login");
          return Promise.reject(error);
        }
      }
      if (error.response.status < 500) {
        return error.response;
      }
    } else {
      console.error("Network error");
      // throw new Error("Network error");
      return Promise.reject(error);
    }
  },
);

export default myAxios;
