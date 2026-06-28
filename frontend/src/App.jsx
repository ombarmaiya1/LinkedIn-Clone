import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Signup from "./pages/SignUp";
import Login from "./pages/Login";
import { useAuth } from "./context/AuthProvider";
import { useContext } from "react";
import { UserDataContext } from "./context/UserContext";
import PrivateRoutes from "./routes/PrivateRoutes";
import PublicRoutes from "./routes/PublicRoutes";
import FeedPage from "./pages/FeedPage";
import { ProfilePage } from "./pages/ProfilePage";
import NetworkPage from "./pages/NetworkPage";

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
        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Navigate to={"/feed"} />} />
          <Route
            path="/profile"
            element={<ProfilePage initialProfile={userData} />}
          />
          <Route path="/network" element={<NetworkPage />} />
          <Route path="/feed" element={<FeedPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
