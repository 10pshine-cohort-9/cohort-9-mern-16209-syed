import React from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardHeader() {
  const navigate = useNavigate();

  return (
    <section className="dashboard-title">
      <div className="title-group">
        <p className="page-label">
          <span className="material-symbols-outlined icon-sm">grid_view</span>
          Dashboard
        </p>
        <h2>Your Notes</h2>
        <p>Create, organize, and manage your notes effortlessly.</p>
      </div>

      <button
        type="button"
        className="new-note-button"
        onClick={() => navigate("/editor")}
      >
        <span className="material-symbols-outlined">add</span>
        <span>New Note</span>
      </button>
    </section>
  );
}