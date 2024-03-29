import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

const myAxios = axios.create({
  baseURL: BASE_API_URL + "/api",
  timeout: 2000,
  //  withCredentials: true,
  //  validateStatus: function (status) {
  //   return status >= 200 && status < 500; // default
  //  },
});

function getAccessToken() {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    console.log("No access token found");
  }
  return token;
}

// Add a request interceptor
myAxios.interceptors.request.use(
  (request) => {
    request.headers.Authorization = `Bearer ${getAccessToken()}`;
    return request;
  },
  (error) => Promise.reject(error),
);

const refreshAccessToken = async (failedRequest) => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      const response = await myAxios.post(
        "/auth/refresh-token",
        { refreshToken },
        // { skipAuthRefresh: true },
      );
      // Check if refresh token valid, otherwise login again
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }

      const tokens = response.data;
      localStorage.setItem("accessToken", tokens.accessToken);
      console.log("Access token refreshed");

      // Retry the original request with the new token
      failedRequest.response.config.headers.Authorization = `Bearer ${tokens.accessToken}`;
      return Promise.resolve();
      // return axios(originalRequest);
    }
  } catch (error) {
    console.error("Token refresh error:", error);
    // Handle refresh token error or redirect to login
    // localStorage.clear();
    // return redirect("/login");
    return Promise.reject(error);
  }
};

createAuthRefreshInterceptor(myAxios, refreshAccessToken);

export default myAxios;
