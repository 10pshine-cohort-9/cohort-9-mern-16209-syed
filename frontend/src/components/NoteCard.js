import React from "react";
import { useNavigate } from "react-router-dom";

export default function NoteCard({ note, getPlainText, onDelete }) {
  const navigate = useNavigate();

  const noteId = note._id || note.id;
  const content = note.content || "<p>No content</p>";
  const plainText = getPlainText ? getPlainText(content) : content;
  const isLongNote = plainText.length > 100;

  const formattedDate = note.createdAt
    ? new Date(note.createdAt).toLocaleDateString("en-GB")
    : "Unknown";

  return (
    <article className="note-card">
      <div className="note-card-top">
        <span className="note-label">NOTE</span>
      </div>

      <h3>{note.title || "Untitled Note"}</h3>

      <div
        className="rich-text-preview"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {isLongNote && (
        <button
          type="button"
          className="view-details-button"
          onClick={() => navigate(`/notes/${noteId}`)}
        >
          View Details →
        </button>
      )}

      <p className="note-date">Created: {formattedDate}</p>

      <div className="note-actions">
        <button
          type="button"
          className="btn-edit"
          onClick={() => navigate(`/editor/${noteId}`)}
        >
          Edit
        </button>

        <button
          type="button"
          className="btn-delete"
          onClick={() => onDelete(noteId)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}