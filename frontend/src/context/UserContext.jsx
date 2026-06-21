import { useState, useEffect } from "react";
import { createContext } from "react";
import api from "../utils/api";
import { useAuth } from "./AuthProvider.jsx";

export const UserDataContext = createContext();
function UserContext({ children }) {
  const { accessToken } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUserData = async () => {
    setLoading(true);
    try {
      let result = await api.get("/getUser");
      setUserData(result.data.user);
    } catch (error) {
      setUserData(null);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      getUserData();
    } else {
      setUserData(null);
      setLoading(false);
    }
  }, [accessToken]);

  const value = { userData, setUserData, loading };
  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

export default UserContext;
