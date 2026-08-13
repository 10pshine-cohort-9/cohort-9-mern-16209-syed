import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import API from "../api/api";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

const editorModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link"],
    ["clean"],
  ],
};

export default function Editor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  // Note data
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Page states
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // Load the existing note
  useEffect(() => {
    if (!isEditMode) return;

    const fetchNote = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(`/notes/${id}`);
        const note =
          response.data.note || response.data.data || response.data;

        setTitle(note.title || "");
        setContent(note.content || "");
      } catch (err) {
        console.error(
          "Error loading note:",
          err.response?.data || err.message
        );
        setError(
          err.response?.data?.message || "Could not load the note"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, isEditMode]);

  // Create or update a note
  const handleSave = async (event) => {
    event.preventDefault();
    setError("");

    const plainText = content.replace(/<[^>]*>/g, "").trim();

    if (!title.trim()) {
      setError("Note title is required");
      return;
    }

    if (!plainText) {
      setError("Note content is required");
      return;
    }

    try {
      setSaving(true);

      const noteData = {
        title: title.trim(),
        content,
      };

      if (isEditMode) {
        await API.put(`/notes/${id}`, noteData);
      } else {
        await API.post("/notes", noteData);
      }

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(
        "Save error:",
        err.response?.data || err.message
      );
      setError(
        err.response?.data?.message || "Failed to save note"
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete current note
  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      await API.delete(`/notes/${id}`);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(
        "Delete error:",
        err.response?.data || err.message
      );
      setError(
        err.response?.data?.message || "Failed to delete note"
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="editor-container">
        <Loader message="Loading note..." />
      </div>
    );
  }

  return (
    <div className="editor-container">
      {/* Header */}
      <div className="editor-header">
        <div>
          <p className="page-label">NOTES</p>
          <h2>{isEditMode ? "Edit Note" : "Create New Note"}</h2>
        </div>

        <button
          type="button"
          className="btn-secondary"
          onClick={() => navigate("/dashboard")}
          disabled={saving || deleting}
        >
          ← Back
        </button>
      </div>

      {/* Error state */}
      {error && <ErrorMessage message={error} />}

      {/* Note form */}
      <form className="note-form" onSubmit={handleSave}>
        {/* Title */}
        <label htmlFor="title">Note Title</label>
        <input
          id="title"
          type="text"
          placeholder="Enter note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={saving || deleting}
          required
        />

        {/* Rich text editor */}
        <label>Note Content</label>
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={editorModules}
          placeholder="Write your note here..."
          className="rich-text-editor"
          readOnly={saving || deleting}
        />

        {/* Action Buttons */}
        <div className="editor-buttons">
          <button
            type="submit"
            className="btn-primary"
            disabled={saving || deleting}
          >
            {saving
              ? "Saving..."
              : isEditMode
              ? "Update Note"
              : "Save Note"}
          </button>

          {isEditMode && (
            <button
              type="button"
              className="btn-delete"
              onClick={handleDelete}
              disabled={saving || deleting}
            >
              {deleting ? "Deleting..." : "Delete Note"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}