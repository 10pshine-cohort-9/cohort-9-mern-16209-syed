import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

export default function NoteDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get selected note
  useEffect(() => {
    const fetchNote = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/notes/${id}`);
        const responseData = response.data;

        const selectedNote =
          responseData.note || responseData.data || responseData;

        setNote(selectedNote);
      } catch (err) {
        console.error(
          "Failed to load note:",
          err.response?.data || err.message
        );

        setError(
          err.response?.data?.message || "Unable to load this note."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  // Loading screen
  if (loading) {
    return (
      <div className="note-details-page">
        <div className="note-details-card">
          <Loader message="Loading note details..." />
        </div>
      </div>
    );
  }

  // Error screen
  if (error) {
    return (
      <div className="note-details-page">
        <div className="note-details-card">
          <ErrorMessage message={error} />
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Note not found state
  if (!note) {
    return (
      <div className="note-details-page">
        <div className="note-details-card">
          <h2>Note Not Found</h2>
          <p>The note you are looking for does not exist or was removed.</p>
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const noteId = note._id || note.id;

  return (
    <main className="note-details-page">
      <section className="note-details-card">
        {/* Top Back button */}
        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

        {/* Header */}
        <div className="note-details-header">
          <div>
            <p className="page-label">NOTE DETAILS</p>
            <h1>{note.title || "Untitled Note"}</h1>
          </div>

          <p className="note-details-date">
            Created:{" "}
            {note.createdAt
              ? new Date(note.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "Unknown"}
          </p>
        </div>

        {/* Full rich-text content */}
        <div
          className="note-full-content"
          dangerouslySetInnerHTML={{
            __html: note.content || "<p>No content available.</p>",
          }}
        />

        {/* Action Buttons */}
        <div className="note-details-actions">
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate(`/editor/${noteId}`)}
          >
            Edit Note
          </button>

          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/dashboard")}
          >
            Back
          </button>
        </div>
      </section>
    </main>
  );
}