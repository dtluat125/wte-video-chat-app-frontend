import axios from "axios";
import { API_BASE_URL, HttpStatus } from "../../common/constants";

const options = {
  headers: {
    "Content-Type": "application/json",
  },
  baseURL: API_BASE_URL,
  responseType: "json",
};

const axiosInstance = axios.create(options);

axiosInstance.interceptors.request.use(async (config) => {
  Object.assign(config, {
    headers: {
      ...config.headers,
      "Content-Type": "application/json",
    },
  });
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    if (typeof response?.data === "string") {
      response.data = JSON.parse(response.data);
    }
    response.data = {
      ...response?.data,
      success: true,
    };
    return response.data;
  },
  async (error) => {
    if (error.code === "ERR_NETWORK") {
      error.request.data = {
        ...(error?.request?.data || {}),
        success: false,
        isRequestError: true,
        message: error.message,
        code: HttpStatus.NETWORK_ERROR,
      };
      return error.request.data;
    } else if (error.response) {
      if (typeof error?.response?.data === "string") {
        error.response.data = JSON.parse(error.response.data);
      }
      if (error?.response?.data) {
        error.response.data = {
          ...(error?.response?.data || {}),
          success: false,
        };
      }

      return error.response.data;
    } else if (error.request) {
      error.request.data = {
        ...(error?.request?.data || {}),
        success: false,
        isRequestError: true,
        message: error.message,
      };
      return error.request?.data;
    }
    return {
      ...error,
      config: error?.config,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      statusText: "System error, please try again later",
      headers: error?.request?.headers || {},
      success: false,
      message: "System error, please try again later",
      data: null,
      code: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }
);

export default axiosInstance;
