import axios from "axios";
import { logOut } from "../features/auth/authSlice";

let store;
export const injectStore = (_store) => {
  store = _store;
};

const axiosFetch = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || "/api",
  withCredentials: true,
});

axiosFetch.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const userType = localStorage.getItem("userType");

axiosFetch.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log(error);
    const originalRequest = error.config;
    if (
      error?.response.status === 401 &&
      error?.response.data.msg === "Access Token is not valid" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const rs = await axiosFetch.get(`/auth/${userType}/refresh`);
        localStorage.setItem("token", rs.data.accessToken);
        return axiosFetch(error.config);
      } catch (err) {
        if (
          err?.response.status === 401 &&
          (err?.response.data.msg === "Invalid refresh token" ||
            err?.response.data.msg === "Refresh token not found")
        ) {
          try {
            store.dispatch(logOut());
            return axiosFetch(err.config);
          } catch (err) {
            return Promise.reject(err);
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosFetch;
