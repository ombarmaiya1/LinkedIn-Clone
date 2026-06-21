import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api.js";

const Signup = () => {

    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/signup" ,formData)
      navigate("/login")
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f2ef] flex justify-center items-center">
      <div className="bg-white w-full max-w-md rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold text-[#0A66C2] mb-2">LinkedIn</h1>

        <h2 className="text-2xl font-semibold mb-6">Join LinkedIn</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <input
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-1/2 border rounded p-3"
            />

            <input
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-1/2 border rounded p-3"
            />
          </div>

          <input
            name="userName"
            placeholder="Username"
            value={formData.userName}
            onChange={handleChange}
            className="w-full border rounded p-3"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded p-3"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded p-3"
          />

          <button
            disabled={loading}
            className="w-full bg-[#0A66C2] text-white py-3 rounded-full font-semibold"
          >
            {loading ? "Creating..." : "Agree & Join"}
          </button>
        </form>

        <p className="text-center mt-6">
          Already on LinkedIn?
          <a href="/login" className="text-[#0A66C2] font-semibold ml-1">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
