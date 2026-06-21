import axios from "axios";
import { APP_URL } from "../config";
import { getToken, setToken } from "./tokenManager";

const api = axios.create({
baseURL: APP_URL,
withCredentials: true,
});


api.interceptors.request.use((config) => {
const token = getToken()

if (token) {
config.headers.Authorization = `Bearer ${token}`;
}

return config;
});

api.interceptors.response.use(
(response) => response,

async (error) => {
const originalRequest = error.config;


if (
  error.response?.status === 401 &&
  !originalRequest._retry
) {
  originalRequest._retry = true;

  try {
    const refreshResponse = await axios.post(
      `${APP_URL}/refresh`,
      {},
      {
        withCredentials: true,
      }
    );

    const newAccessToken =
      refreshResponse.data.accessToken;

    setToken(newAccessToken)

    originalRequest.headers.Authorization =
      `Bearer ${newAccessToken}`;

    return api(originalRequest);
  } catch (err) {
   setToken(null)

    window.location.href = "/login";

    return Promise.reject(err);
  }
}

return Promise.reject(error);

}
);

export default api;
