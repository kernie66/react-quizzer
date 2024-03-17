import myAxios from "./myAxios.instance.js";
import { clearLoggedInUserId, getLoggedInUserId } from "./helpers/queryDataHelper.js";

export default class AxiosApiClient {
  constructor(onError) {
    this.onError = onError;
  }

  async request(options) {
    let response;
    try {
      response = await myAxios.request(options.url, {
        params: options.query,
        method: options.method,
        data: options.data,
        baseURL: options.baseURL,
      });
    } catch (error) {
      console.log("Request error:", error);
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

  async request2(options) {
    let response;
    response = await myAxios.request(options.url, {
      params: options.query,
      method: options.method,
      data: options.data,
      baseURL: options.baseURL,
    });
    console.log("Request 2:", response.status);
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
    return this.request2({ method: "GET", url, query, ...options });
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
    if (response.ok) {
      console.log("Login response:", response.data);
      this.setUserId(response.data.id);
      this.setTokens(response.data);
    }
    return response;
  }

  async checkLoggedIn() {
    console.log("Checking login");
    let response = await this.get("/login");
    response.userId = this.getUserId();
    console.log("Check login:", response);
    return response;
  }

  async logout() {
    const response = await this.delete("/auth/logout");
    console.log("Response:", response);
    if (response.ok) {
      this.removeLogin();
    }
    return response;
    //  return redirect("/login");
  }

  isAuthenticated() {
    // const userId = getLoggedInUserId();
    const userId = localStorage.getItem("userData");
    if (userId) {
      return true;
    } else {
      return false;
    }
  }

  isLoggedIn() {
    try {
      const loggedInId = getLoggedInUserId();

      if (loggedInId && loggedInId > 0) {
        console.log("User %d is logged in", loggedInId);
        return true;
      } else {
        console.log("No user logged in");
        // this.removeLogin();
        return false;
      }
    } catch (error) {
      console.log(error.message);
      this.logout();
      clearLoggedInUserId();
      return false;
    }
  }

  setUserId(userId) {
    console.log("Set user ID:", userId);
    localStorage.setItem("userData", userId);
  }

  getUserId() {
    return localStorage.getItem("userData");
  }

  removeLogin() {
    console.log("Removing user data from local storage");
    return localStorage.clear();
  }

  setTokens(tokens) {
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
  }
}
