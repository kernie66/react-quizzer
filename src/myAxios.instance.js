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

export default myAxios;
