import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import ErrorMessage from "../components/ErrorMessage";

export default function Login({ setAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Prevent submission when browser form validation fails
    if (!event.currentTarget.checkValidity()) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await loginUser({
        email,
        password,
      });

      // Flexible extraction in case response format varies
      const data = response.data?.data || response.data;
      const token = data.token;
      const user = data.user;

      if (!token) {
        throw new Error(
          "No authorization token returned from server."
        );
      }

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      setAuth(true);

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err) {
      console.error(
        "Login error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to log in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="app-title">
          Notes Manager
        </h1>

        <h2>Welcome Back</h2>

        <p className="auth-description">
          Sign in to access and manage your personal notes.
        </p>

        {error && (
          <ErrorMessage message={error} />
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              autoComplete="email"
              disabled={loading}
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              autoComplete="current-password"
              disabled={loading}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Log In"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/signup">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}