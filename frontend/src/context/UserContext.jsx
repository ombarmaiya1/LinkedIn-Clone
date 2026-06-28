import { useState, useEffect } from "react";
import { createContext } from "react";
import api from "../utils/api";
import { useAuth } from "./AuthProvider.jsx";
import socket, { connectSocket, disconnectSocket } from "../utils/socket";

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

  useEffect(() => {
    if (!accessToken || !userData?._id) {
      disconnectSocket();
      return;
    }

    connectSocket(userData._id);

    const handleNetworkUpdated = () => {
      getUserData();
    };

    socket.on("network:updated", handleNetworkUpdated);

    return () => {
      socket.off("network:updated", handleNetworkUpdated);
    };
  }, [accessToken, userData?._id]);

  const value = {
    userData,
    setUserData,
    loading,
    refreshUserData: getUserData,
  };
  return (
    <UserDataContext.Provider value={value}>
      {!loading && children}
    </UserDataContext.Provider>
  );
}

export default UserContext;
