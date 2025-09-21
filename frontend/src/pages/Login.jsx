import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../main";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      console.log(result);
      setEmail("");
      setPassword("");
    } catch (error) {
      setError(
        error.response?.data?.message || "An error occurred during login."
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#23262f] p-4">
      <div className="flex w-full max-w-md flex-col gap-10 rounded-xl bg-[#343440] p-8 shadow-lg shadow-black/20">
        {/* Login Heading */}
        <div className="flex flex-col items-center justify-center gap-4 border-b border-gray-500 pb-8">
          <img src="/logo.png" alt="GiggleChat Logo" className="h-24 w-24" />
          <h1 className="text-3xl font-bold text-gray-200">
            Login to GiggleChat
          </h1>
        </div>

        {/* Form */}
        <form
          className="flex w-full flex-col items-center gap-6"
          onSubmit={handleLogin}
        >
          <div className="w-full">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-lg border-2 border-transparent bg-gray-200 px-4 py-3 text-gray-800 shadow-inner shadow-black/10 transition duration-300 focus:border-[#00e4e3] focus:outline-none focus:ring-2 focus:ring-[#00e4e3]/50"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="w-full">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full rounded-lg border-2 border-transparent bg-gray-200 px-4 py-3 pr-10 text-gray-800 shadow-inner shadow-black/10 transition duration-300 focus:border-[#00e4e3] focus:outline-none focus:ring-2 focus:ring-[#00e4e3]/50"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 cursor-pointer"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="mt-4 w-full rounded-full bg-[#00e4e3] px-6 py-3 text-lg font-bold text-gray-800 shadow-lg shadow-black/20 transition hover:bg-[#00c2c1] focus:outline-none focus:ring-2 focus:ring-[#00e4e3] focus:ring-offset-2 focus:ring-offset-[#343440] disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-[#00e4e3] cursor-pointer"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
