import { useState } from "react";
import axios from "axios";
import {API_BASE_URL} from "../../utils/constants";


const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(`${API_BASE_URL}/provider/request-password-reset/`, { email });
      setSent(true);
    } catch (err) {
      setError("Could not send reset email. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded">
      <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
      {sent ? (
        <p className="text-green-600">Check your email for a password reset link.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm text-gray-800">Email Address</label>
          <input
            type="email"
            className="border p-2 w-full mb-4"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button
            className="bg-emerald-500 text-white px-4 py-2 rounded w-full"
            type="submit"
          >
            Send Reset Link
          </button>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordPage;