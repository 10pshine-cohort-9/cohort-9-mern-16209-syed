import React from "react";
import ProfileMenu from "./ProfileMenu";

export default function Navbar({ user, onLogout }) {
  return (
    <header className="professional-header">
      <div className="header-brand">
        <div className="logo-box">N</div>
        <div>
          <h1 className="app-name">Notes Manager</h1>
          <p className="app-tagline">
            Organize your work and ideas efficiently
          </p>
        </div>
      </div>

      <ProfileMenu user={user} onLogout={onLogout} />
    </header>
  );
}