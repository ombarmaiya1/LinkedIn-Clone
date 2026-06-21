import { useNavigate } from "react-router-dom";
import api from "../utils/api"
import { UserDataContext } from "../context/UserContext";
import { useContext } from "react";

function Home() {

  const {userData,setUserData} = useContext(UserDataContext)
  const navigate = useNavigate();
  const logout = async () => {
    await api.post('/logout',{});
    setUserData(null);
    console.log(userData);
    navigate('/login');
    

    console.log("logged out");
    
  }
  return (
    <div>Home<button className="btn border-t-cyan-500 p-5 bg-amber-300" onClick={logout}>logout</button>
    </div>
  )
}

export default Home