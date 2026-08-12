import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import ErrorMessage from "../components/ErrorMessage";

export default function Signup({ setAuth }) {
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Create account handler
  const handleSignup = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      // Flexible extraction to handle different backend wrapper formats
      const responseData = response.data?.data || response.data;
      const { token, user } = responseData;

      if (!token) {
        throw new Error(
          "Account was created, but no authentication token was received."
        );
      }

      // Store credentials
      localStorage.setItem("token", token);
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      setAuth(true);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Signup failed:", err.response?.data || err.message);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="app-title">Notes Manager</h1>
        <h2>Create Account</h2>
        <p className="auth-description">
          Create an account to save and organize your notes.
        </p>

        {/* Shared Error Component */}
        {error && <ErrorMessage message={error} />}

        {/* Signup form */}
        <form onSubmit={handleSignup}>
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              className="form-input"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              minLength={6}
              required
              disabled={loading}
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
}