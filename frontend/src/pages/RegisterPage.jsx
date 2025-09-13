import { useState } from "react";
import useRegister from "../hooks/useRegister";
import { Link } from "react-router";

const RegisterPage = () => {
  const { isPending, error, registerMutation } = useRegister();

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  function handleRegister(e) {
    e.preventDefault();
    registerMutation(registerData);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-gray-800 p-6 rounded-2xl shadow-md w-80 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-white">Register</h2>

        {error && (
          <div className="mb-4 text-red-400 text-sm text-center">
            {error.response?.data?.message}
          </div>
        )}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={registerData.name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-600 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={registerData.email}
          onChange={handleChange}
          className="w-full p-2 border border-gray-600 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={registerData.address}
          onChange={handleChange}
          className="w-full p-2 border border-gray-600 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Password field with show/hide */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={registerData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-600 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-400"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? "Register..." : "Register"}
        </button>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </form>

      {isPending && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

    </div>
  );
};

export default RegisterPage;
