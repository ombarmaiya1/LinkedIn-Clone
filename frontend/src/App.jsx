import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Signup from "./pages/SignUp";
import Home from "./pages/Home";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import { useAuth } from "./context/AuthProvider";
import { useContext } from "react";
import { UserDataContext } from "./context/UserContext";
import PrivateRoutes from "./routes/PrivateRoutes";
import PublicRoutes from "./routes/PublicRoutes";

function App() {
  const { loading } = useAuth();
  const { userData, loading: userLoading } = useContext(UserDataContext);

  if (loading || userLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>

        <Route element={<PublicRoutes/>}>
           <Route  path="/login" element={<Login/> }/>
            <Route path="/signup" element={<Signup />} />
        </Route>
        <Route element={<PrivateRoutes/>}>
          <Route path="/" element={<Home />} />
         
          <Route path="/feed" element={<Feed />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
