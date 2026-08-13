import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile({ setAuth }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Load user information from storage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Unable to read user information:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setAuth(false);
    navigate("/login", { replace: true });
  };

  // Safe avatar initial computation
  const userInitial = user?.name
    ? user.name.trim().charAt(0).toUpperCase()
    : "U";

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header section */}
        <div className="profile-header">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>

          <h1>My Profile</h1>
          <p>View your account information</p>
        </div>

        {/* Profile Card */}
        <div className="profile-card">
          {/* Avatar */}
          <div className="profile-avatar">{userInitial}</div>

          <h2>{user?.name || "User"}</h2>
          <p className="profile-role">Notes Manager User</p>

          {/* User Information */}
          <div className="profile-details">
            <div className="profile-detail">
              <span className="detail-label">Full Name</span>
              <strong className="detail-value">
                {user?.name || "Not available"}
              </strong>
            </div>

            <div className="profile-detail">
              <span className="detail-label">Email Address</span>
              <strong className="detail-value">
                {user?.email || "Not available"}
              </strong>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="profile-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>

            <button
              type="button"
              className="profile-logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}