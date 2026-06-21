import { useState } from "react";
import axios from "axios";
import { APP_URL } from "../config";
import { useAuth } from "../context/AuthProvider";
import api from "../utils/api";
import { setToken } from "../utils/tokenManager";
import { useNavigate } from "react-router-dom";

const Login= () => {


  const navigate = useNavigate();
  const {setAccessToken} = useAuth();  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post('/login', formData);

      console.log(response);
      
      setAccessToken(response.data.accessToken);
      setToken(response.data.accessToken)
       
       
    } catch (error) {
      console.log(error)

      alert(
        error.response?.data?.message ||
          error.response?.data ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f2ef] flex justify-center items-center">
      <div className="bg-white w-full max-w-md rounded-lg shadow-md p-8">
        
        <h1 className="text-4xl font-bold text-[#0A66C2] mb-2">
          LinkedIn
        </h1>

        <h2 className="text-2xl font-semibold mb-6">
          Sign In
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded p-3"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded p-3"
          />

          <button
            disabled={loading}
            className="w-full bg-[#0A66C2] text-white py-3 rounded-full font-semibold"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-6">
          New to LinkedIn?
          <a
            href="/signup"
            className="text-[#0A66C2] font-semibold ml-1"
          >
            Join now
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;