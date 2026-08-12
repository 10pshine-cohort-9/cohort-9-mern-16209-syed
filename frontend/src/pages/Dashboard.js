import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteNote, getNotes } from "../api/notesApi";

// Imported components matching your folder structure
import Navbar from "../components/Navbar";
import DashboardHeader from "../components/DashboardHeader";
import SearchBar from "../components/SearchBar";
import NoteCard from "../components/NoteCard";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

export default function Dashboard({ setAuth }) {
  const navigate = useNavigate();

  // States
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Convert rich-text HTML into plain text
  const getPlainText = (html = "") => {
    return html
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/\s+/g, " ")
      .trim();
  };

  // Load logged-in user
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) return;

    try {
      const userData = JSON.parse(savedUser);
      setUser(userData);
    } catch (err) {
      console.error("Unable to read user data:", err);
      localStorage.removeItem("user");
    }
  }, []);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth(false);
    navigate("/login", { replace: true });
  };

  // Fetch notes from API
  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getNotes();
      const data = response.data;

      const notesData = Array.isArray(data)
        ? data
        : data.notes || data.data || [];

      setNotes(notesData);
    } catch (err) {
      console.error(
        "Failed to load notes:",
        err.response?.data || err.message
      );

      const status = err.response?.status;
      if (status === 401 || status === 403) {
        handleLogout();
        return;
      }

      setError(
        err.response?.data?.message || "Failed to load notes."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Delete note
  const handleDelete = async (noteId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (!confirmed) return;

    try {
      await deleteNote(noteId);

      setNotes((currentNotes) =>
        currentNotes.filter((note) => {
          const currentId = note._id || note.id;
          return String(currentId) !== String(noteId);
        })
      );
    } catch (err) {
      console.error(
        "Failed to delete note:",
        err.response?.data || err.message
      );
      alert(
        err.response?.data?.message || "Failed to delete note."
      );
    }
  };

  // Search filter logic
  const searchText = search.toLowerCase().trim();
  const filteredNotes = notes.filter((note) => {
    const title = (note.title || "").toLowerCase();
    const content = getPlainText(note.content || "").toLowerCase();
    return title.includes(searchText) || content.includes(searchText);
  });

  // Calculate notes count label
  const displayedCount = searchText ? filteredNotes.length : notes.length;
  const noteCount = `${displayedCount} ${
    displayedCount === 1 ? "note" : "notes"
  } ${searchText ? "found" : "saved"}`;

  return (
    <div className="dashboard-page">
      {/* Top Navbar Header */}
      <Navbar user={user} onLogout={handleLogout} />

      <main className="dashboard-layout">
        {/* Title Section with "+ New Note" Button */}
        <DashboardHeader />

        {/* Search Bar & Counter */}
        <SearchBar
          search={search}
          setSearch={setSearch}
          noteCount={noteCount}
        />

        {/* Loading State */}
        {loading && <Loader message="Loading your notes..." />}

        {/* Error State */}
        {!loading && error && <ErrorMessage message={error} />}

        {/* Empty State: No notes created yet */}
        {!loading && !error && notes.length === 0 && (
          <EmptyState
            icon="📝"
            title="No notes yet"
            message="Start organizing your ideas by creating your first note."
            showButton={true}
            buttonText="Create First Note"
            onButtonClick={() => navigate("/editor")}
          />
        )}

        {/* Empty State: No search results found */}
        {!loading && !error && notes.length > 0 && filteredNotes.length === 0 && (
          <EmptyState
            icon="🔎"
            title="No matching notes"
            message="Try another search keyword."
            showButton={false}
          />
        )}

        {/* Notes Grid Display */}
        {!loading && !error && filteredNotes.length > 0 && (
          <div className="notes-grid">
            {filteredNotes.map((note) => {
              const noteId = note._id || note.id;
              return (
                <NoteCard
                  key={noteId}
                  note={note}
                  getPlainText={getPlainText}
                  onDelete={handleDelete}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}