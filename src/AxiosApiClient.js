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

export default class AxiosApiClient {
  constructor(onError) {
    this.onError = onError;
  }

  async request(options) {
    let response;
    console.log("Options:", options);
    try {
      response = await myAxios.request(options.url, {
        params: options.query,
        method: options.method,
        data: options.data,
        baseURL: options.baseURL,
      });
      console.log("Response:", response);
    } catch (error) {
      console.log("Error:", error);
      response = {
        ok: false,
        status: 500,
        json: async () => {
          return {
            code: 500,
            message: "The server is unresponsive",
            description: error.toString(),
          };
        },
      };
    }
    if (response.status >= 500 && this.onError) {
      this.onError(response);
    }
    // Imitate fetch() response
    return {
      ok: response.status < 200 || response.status > 299 ? false : true,
      status: response.status,
      data: response.status !== 204 ? response.data : null,
    };
  }

  async get(url, query, options) {
    return this.request({ method: "GET", url, query, ...options });
  }

  async post(url, data, options) {
    return this.request({ method: "POST", url, data, ...options });
  }

  async put(url, data, options) {
    return this.request({ method: "PUT", url, data, ...options });
  }

  async delete(url, options) {
    return this.request({ method: "DELETE", url, ...options });
  }

  async register(data) {
    const response = await this.post("/auth/register", data);
    console.log("Register:", response);
    return response;
  }

  async login(username, password) {
    const response = await this.post("/auth/login", { username, password });
    console.log("Login:", response);
    if (response.ok) {
      this.setUserId(response.data.id);
    }
    return response;
  }

  async checkLoggedIn() {
    const response = await this.get("/auth/login", {});
    console.log("Check login:", response);
    return response;
  }

  async logout() {
    const response = await this.delete("/auth/logout");
    console.log("Logout:", response);
    if (response.ok) {
      this.removeUserId();
    }
    return response;
  }

  isAuthenticated() {
    return localStorage.getItem("userData") !== undefined;
  }

  setUserId(userId) {
    localStorage.setItem("userData", userId);
  }

  getUserId() {
    console.log("UserData:", localStorage.getItem("userData"));
    return localStorage.getItem("userData");
  }

  removeUserId() {
    return localStorage.removeItem("userData");
  }
}
