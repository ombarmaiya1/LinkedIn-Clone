import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { UserDataContext } from "../context/UserContext";
import { useContext } from "react";
import { useAuth } from "../context/AuthProvider";
import { setToken } from "../utils/tokenManager";

function Home() {
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();
  const { setUserData } = useContext(UserDataContext);

  const logout = async () => {
    try {
      await api.post("/logout", {});
    } catch (error) {
      console.log(error);
    } finally {
      setUserData(null);
      setToken(null);
      setAccessToken(null);
      navigate("/login");
    }
  };

  return (
    <div>
      Home
      <button
        className="btn border-t-cyan-500 p-5 bg-amber-300"
        onClick={logout}
      >
        logout
      </button>
    </div>
  );
}

export default Home;
