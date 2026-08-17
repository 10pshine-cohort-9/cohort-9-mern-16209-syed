import React, { useState, useRef, useEffect } from "react";
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
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const userInitial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="profile-menu" ref={menuRef}>
      <button
        type="button"
        className="profile-button"
        onClick={() => setMenuOpen((current) => !current)}
      >
        <div className="user-avatar">{userInitial}</div>

        <div className="profile-summary">
          <strong>{user?.name || "User"}</strong>
          <span>My Account</span>
        </div>

        <span className="menu-arrow">{menuOpen ? "▲" : "▼"}</span>
      </button>

      {menuOpen && (
        <div className="profile-dropdown">
          <div className="dropdown-user">
            <div className="dropdown-avatar">{userInitial}</div>
            <div>
              <strong>{user?.name || "User"}</strong>
              <p>{user?.email || "No email available"}</p>
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