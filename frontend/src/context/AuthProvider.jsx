import { createContext, useContext, useEffect, useState } from "react";
import { APP_URL } from "../config";
import { setToken } from "../utils/tokenManager";
import axios from "axios";

const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const refreshToken = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${APP_URL}/refresh`,
          {},
          {
            withCredentials: true,
          },
        );
        setAccessToken(response.data.accessToken);
        setToken(response.data.accessToken);
      } catch (error) {
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    refreshToken();
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
