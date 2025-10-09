import { HttpError } from "@refinedev/core";
import { TOKEN_KEY } from "@utils/constants";
import axios, { InternalAxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: "https://octarinedev.mhafizsir.com/admin",
});

axiosInstance.interceptors.request.use(
  (request: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      // Use the `set` method to safely update the Authorization header
      request.headers.set("Authorization", `Bearer ${token}`);
    }
    return request;
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const customError: HttpError = {
      ...error,
      errors: error.response?.data?.errors,
      message: error.response?.data?.message,
      statusCode: error.response?.status,
    };

    return Promise.reject(customError);
  }
);

export { axiosInstance };
