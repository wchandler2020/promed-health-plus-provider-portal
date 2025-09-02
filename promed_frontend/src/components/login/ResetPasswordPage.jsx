import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import {API_BASE_URL} from "../../utils/constants";


const ResetPasswordPage = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Password checks
  const hasMinLength = password.length >= 12;
  const hasUppercase = (password.match(/[A-Z]/g) || []).length >= 2;
  const hasLowercase = (password.match(/[a-z]/g) || []).length >= 2;
  const hasNumbers = (password.match(/[0-9]/g) || []).length >= 2;
  const hasSpecialChars = (password.match(/[^A-Za-z0-9]/g) || []).length >= 2;

  const allValid =
    hasMinLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumbers &&
    hasSpecialChars &&
    password === password2;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!allValid) {
      setError("Password does not meet all requirements or does not match.");
      return;
    }
    try {
      await axios.post(
        `${API_BASE_URL}/provider/reset-password/${token}/`,
        {
          password,
          confirm_password: password2,
        }
      );
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "There was an error resetting your password."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded">
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>
      {success ? (
        <p className="text-green-600">Password reset! Redirecting to login...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label
              htmlFor="password"
              className="block mb-2 text-sm text-gray-800"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:bg-white dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 focus:ring focus:ring-blue-400 focus:outline-none focus:ring-opacity-40"
              required
            />

            <div className="mt-2 text-sm">
              <ul className="list-disc list-inside text-gray-500">
                <li
                  className={
                    hasMinLength
                      ? "text-green-600 flex items-center"
                      : "flex items-center"
                  }
                >
                  {hasMinLength && (
                    <IoCheckmarkCircleOutline className="mr-1 text-green-600" />
                  )}
                  Minimum 12 characters
                </li>
                <li
                  className={
                    hasUppercase
                      ? "text-green-600 flex items-center"
                      : "flex items-center"
                  }
                >
                  {hasUppercase && (
                    <IoCheckmarkCircleOutline className="mr-1 text-green-600" />
                  )}
                  At least two uppercase letters
                </li>
                <li
                  className={
                    hasLowercase
                      ? "text-green-600 flex items-center"
                      : "flex items-center"
                  }
                >
                  {hasLowercase && (
                    <IoCheckmarkCircleOutline className="mr-1 text-green-600" />
                  )}
                  At least two lowercase letters
                </li>
                <li
                  className={
                    hasNumbers
                      ? "text-green-600 flex items-center"
                      : "flex items-center"
                  }
                >
                  {hasNumbers && (
                    <IoCheckmarkCircleOutline className="mr-1 text-green-600" />
                  )}
                  At least two numbers
                </li>
                <li
                  className={
                    hasSpecialChars
                      ? "text-green-600 flex items-center"
                      : "flex items-center"
                  }
                >
                  {hasSpecialChars && (
                    <IoCheckmarkCircleOutline className="mr-1 text-green-600" />
                  )}
                  At least two special characters
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-4">
            <label
              htmlFor="confirmPassword"
              className="block mb-2 text-sm text-gray-800"
            >
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Repeat your password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:bg-white dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 focus:ring focus:ring-blue-400 focus:outline-none focus:ring-opacity-40"
              required
            />
          </div>

          <div className="mt-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <span className="ml-2 text-sm text-gray-600">
                Show Password
              </span>
            </label>
          </div>

          <button
            className="bg-emerald-500 text-white px-4 py-2 rounded w-full mt-4"
            type="submit"
            disabled={!allValid}
          >
            Reset Password
          </button>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </form>
      )}
    </div>
  );
};

export default ResetPasswordPage;