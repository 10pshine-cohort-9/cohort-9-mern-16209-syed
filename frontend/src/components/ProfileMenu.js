import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export default function ProfileMenu({ user, onLogout }) {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const userName = typeof user?.name === "string" ? user.name : "";
  const userEmail = typeof user?.email === "string" ? user.email : "";

  const userInitial = userName.trim().charAt(0).toUpperCase() || "U";
  const displayName = userName || "User";
  const displayEmail = userEmail || "No email available";

  return (
    <div className="profile-menu" ref={menuRef}>
      <button
        type="button"
        className="profile-button"
        onClick={() => setMenuOpen((current) => !current)}
      >
        <div className="user-avatar">{userInitial}</div>

        <div className="profile-summary">
          <strong>{displayName}</strong>
          <span>My Account</span>
        </div>

        <span className="menu-arrow">
          {menuOpen ? "▲" : "▼"}
        </span>
      </button>

      {menuOpen && (
        <div className="profile-dropdown">
          <div className="dropdown-user">
            <div className="dropdown-avatar">{userInitial}</div>

            <div>
              <strong>{displayName}</strong>
              <p>{displayEmail}</p>
            </div>
          </div>

          <div className="dropdown-line" />

          <button
            type="button"
            className="dropdown-item"
            onClick={() => {
              setMenuOpen(false);
              navigate("/profile");
            }}
          >
            <span>👤</span>
            My Profile
          </button>

          <button
            type="button"
            className="dropdown-item logout-item"
            onClick={onLogout}
          >
            <span>↪</span>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

ProfileMenu.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
  }),
  onLogout: PropTypes.func.isRequired,
};
